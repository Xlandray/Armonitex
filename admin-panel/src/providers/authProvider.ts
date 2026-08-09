import type { AuthProvider } from "@refinedev/core";

import { axiosInstance } from "./axios";

type Identity = {
  id: string;
  email: string;
  full_name: string | null;
  is_superuser: boolean;
};

async function getIdentity(): Promise<Identity | null> {
  try {
    const { data } = await axiosInstance.get<Identity>("/users/me");
    return data;
  } catch {
    return null;
  }
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const formData = new URLSearchParams({ username: email, password });
    try {
      const { data } = await axiosInstance.post("/auth/token", formData);
      localStorage.setItem("access_token", data.access_token);
      return { success: true, redirectTo: "/contents" };
    } catch {
      return {
        success: false,
        error: {
          message: "Giriş başarısız",
          name: "E-posta adresi veya parola hatalı.",
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem("access_token");
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    const authenticated = Boolean(localStorage.getItem("access_token"));
    return authenticated
      ? { authenticated: true }
      : { authenticated: false, logout: true, redirectTo: "/login" };
  },
  getPermissions: async () => {
    const identity = await getIdentity();
    return identity?.is_superuser ? ["admin"] : [];
  },
  getIdentity,
  onError: async (error) => {
    const httpError = error as { response?: { status?: number }; statusCode?: number };
    if (httpError.statusCode === 401 || httpError.response?.status === 401) {
      localStorage.removeItem("access_token");
      return { logout: true, redirectTo: "/login" };
    }
    return {};
  },
};
