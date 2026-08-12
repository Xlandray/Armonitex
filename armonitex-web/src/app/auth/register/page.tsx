"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Pydantic UserCreate şeması (email, full_name, password)
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // API isteği başarılı olduğunda dönüşümü (conversion) Google'a bildir
        sendGAEvent("event", "generate_lead", {
          method: "register_form",
          currency: "TRY",
        });
      }

      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-2xl font-semibold tracking-tight text-main-token">
          Yeni Hesap Oluştur
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleRegister}>
        <div>
          <label className="form-label-token">Ad Soyad</label>
          <input
            name="full_name"
            type="text"
            required
            className="input-token mt-1"
            placeholder="Mert Simge"
          />
        </div>

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

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary-token w-full justify-center disabled:opacity-50"
        >
          {isLoading ? "Oluşturuluyor..." : "Kayıt Ol"}
        </button>

        <div className="text-center text-sm">
          <Link href="/auth/login" className="font-semibold text-brand-token hover:underline">
            Zaten hesabınız var mı? Giriş yapın
          </Link>
        </div>
      </form>
    </div>
  );
}
