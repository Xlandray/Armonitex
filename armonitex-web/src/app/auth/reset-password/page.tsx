"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    if (newPassword.length < 12) {
      setError("Şifre en az 12 karakter olmalıdır.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push("/auth/login"), 1500);
      } else {
        const body = (await res.json().catch(() => ({}))) as { detail?: string };
        setError(body.detail ?? "Şifre sıfırlanamadı.");
      }
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <p className="text-muted-token text-center">Geçersiz bağlantı.</p>;
  }
  if (done) {
    return (
      <p className="text-center text-main-token">Şifreniz güncellendi. Yönlendiriliyorsunuz…</p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-main-token">
        Yeni Şifre Belirleyin
      </h2>
      {error ? (
        <p className="badge-magenta-token block text-center" role="alert">
          {error}
        </p>
      ) : null}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="form-label-token">Yeni Şifre</label>
          <input
            name="password"
            type="password"
            required
            minLength={12}
            className="input-token mt-1"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary-token w-full justify-center disabled:opacity-50"
        >
          {isLoading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
      <p className="text-center text-sm">
        <Link href="/auth/login" className="text-brand-token hover:underline">
          Girişe dön
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-muted-token text-center">Yükleniyor…</p>}>
      <ResetForm />
    </Suspense>
  );
}
