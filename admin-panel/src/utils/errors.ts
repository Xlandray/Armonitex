import type { HttpError } from "@refinedev/core";

// axios interceptor'i (providers/axios.ts) her hatayi HttpError'a cevirir.
// Refine hook'lari mesaji kendisi gosterir; elle axios cagiran sayfalar bunu
// kullanarak ayni mesaji yakalar, yoksa kendi genel metnine duser.
export function errorMessage(error: unknown, fallback: string): string {
  const message = (error as HttpError | undefined)?.message;
  return typeof message === "string" && message.length > 0 ? message : fallback;
}
