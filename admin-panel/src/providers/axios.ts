import axios, { type AxiosError } from "axios";
import type { HttpError, ValidationErrors } from "@refinedev/core";

export const apiBaseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10_000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// FastAPI iki sekilde hata doner:
//   { detail: "Content was not found." }                  -> 404/409/403
//   { detail: [{ loc, msg, type }, ...] }                 -> 422 dogrulama
// Ikisini de Refine'in HttpError'ina cevirir; boylece notificationProvider
// mesaji gosterebilir ve formlar errors haritasini alanlara baglayabilir.

type ValidationItem = { loc?: (string | number)[]; msg: string };
type ErrorBody = { detail?: string | ValidationItem[] };

const NETWORK_MESSAGE = "Sunucuya ulaşılamadı. Bağlantını kontrol edip tekrar dene.";
const UNKNOWN_MESSAGE = "Beklenmeyen bir hata oluştu.";

// loc dizisinin son elemani alan adidir: ["body", "email"] -> "email"
function toValidationErrors(items: ValidationItem[]): ValidationErrors {
  const grouped: Record<string, string[]> = {};
  for (const item of items) {
    const field = String(item.loc?.at(-1) ?? "");
    if (!field) continue;
    (grouped[field] ??= []).push(item.msg);
  }
  return grouped;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorBody>) => {
    const statusCode = error.response?.status ?? 0;
    const detail = error.response?.data?.detail;

    if (Array.isArray(detail)) {
      const httpError: HttpError = {
        message: detail.map((item) => item.msg).join(" · ") || UNKNOWN_MESSAGE,
        statusCode,
        errors: toValidationErrors(detail),
      };
      return Promise.reject(httpError);
    }

    const httpError: HttpError = {
      message: detail || (error.response ? UNKNOWN_MESSAGE : NETWORK_MESSAGE),
      statusCode,
    };
    return Promise.reject(httpError);
  },
);
