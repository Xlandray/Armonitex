"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/portal";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      if (res.ok) {
        router.push(next);
        router.refresh();
      } else {
        const body = (await res.json().catch(() => ({}))) as { detail?: string };
        setError(body.detail ?? "Giriş başarısız.");
      }
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-2xl font-semibold tracking-tight text-main-token">
          Hesabınıza Giriş Yapın
        </h2>
      </div>

      {error ? (
        <p className="badge-magenta-token block text-center" role="alert">
          {error}
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="form-label-token">E-posta</label>
          <input
            name="email"
            type="email"
            required
            className="input-token mt-1"
            placeholder="ornek@armonitex.com"
          />
        </div>

        <div>
          <label className="form-label-token">Şifre</label>
          <input
            name="password"
            type="password"
            required
            className="input-token mt-1"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-end text-sm">
          <Link
            href="/auth/forgot-password"
            className="font-semibold text-brand-token hover:underline"
          >
            Şifremi unuttum
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary-token w-full justify-center disabled:opacity-50"
        >
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-muted-token text-center">Yükleniyor…</p>}>
      <LoginForm />
    </Suspense>
  );
}
