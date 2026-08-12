"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // FastAPI OAuth2 standardı e-postayı 'username' olarak bekler
    const body = new URLSearchParams();
    body.append("username", formData.get("email") as string);
    body.append("password", formData.get("password") as string);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (res.ok) {
        await res.json();
        router.push("/"); 
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center font-display text-2xl font-extrabold tracking-tight text-main-token">
          Hesabınıza Giriş Yapın
        </h2>
      </div>

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

        <div className="flex items-center justify-between text-sm">
          <Link href="/auth/register" className="font-semibold text-brand-token hover:underline">
            Hesap oluştur
          </Link>
          <Link href="/auth/forgot-password" className="font-semibold text-brand-token hover:underline">
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
