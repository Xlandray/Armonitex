"use client";
import { useState } from "react";

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus({ success: true, message: "Teklif talebiniz başarıyla alındı! Ekibimiz kısa sürede sizinle iletişime geçecektir." });
        (e.target as HTMLFormElement).reset();
      } else {
        const data = await res.json().catch(() => null);
        setStatus({ success: false, message: data?.detail || "Mesaj gönderilirken bir hata oluştu." });
      }
    } catch {
      setStatus({ success: false, message: "Sunucuya bağlanılamadı. Lütfen tekrar deneyin." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-token p-6 sm:p-8 bg-white-token space-y-5">
      <div className="space-y-1 pb-4 border-b border-token">
        <div className="flex items-center gap-2 label-mono-token">
          <span className="reg-cross-token" aria-hidden />
          Teklif Formu
        </div>
        <h2 className="font-display text-xl font-bold text-main-token">Projenizi Anlatın</h2>
      </div>
      {status && (
        <div
          className={`p-4 rounded-md text-sm font-semibold border ${
            status.success
              ? "bg-cyan-soft-token border-cyan-token text-brand-token"
              : "bg-magenta-soft-token border-magenta-token text-magenta-token"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label-token">Ad Soyad *</label>
            <input name="name" type="text" required className="input-token" placeholder="Mert Simge" />
          </div>

          <div>
            <label className="form-label-token">E-posta *</label>
            <input
              name="email"
              type="email"
              required
              className="input-token"
              placeholder="ornek@armonitex.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label-token">Telefon</label>
            <input name="phone" type="tel" className="input-token" placeholder="05xx xxx xx xx" />
          </div>

          <div>
            <label className="form-label-token">Baskı / Hizmet Türü</label>
            <select name="service" className="input-token">
              <option value="ic_mekan">İç Mekan Dijital Baskı</option>
              <option value="dis_mekan">Dış Mekan Vinil / Mesh Baskı</option>
              <option value="tabela">Işıklı / Işıksız Tabela &amp; Totem</option>
              <option value="display">Roll-up &amp; Örümcek Stand</option>
              <option value="arac_giydirme">Araç / Cephe Giydirme</option>
              <option value="diger">Diğer / Genel İletişim</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label-token">Proje Detayları &amp; Mesajınız *</label>
          <textarea
            name="message"
            rows={4}
            required
            className="input-token"
            placeholder="Baskı ölçüleri, miktar ve teslim tarihi detaylarını belirtebilirsiniz..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary-token w-full justify-center disabled:opacity-50"
        >
          {isLoading ? "Gönderiliyor..." : "Teklif Talebini Gönder →"}
        </button>
      </form>
    </div>
  );
}
