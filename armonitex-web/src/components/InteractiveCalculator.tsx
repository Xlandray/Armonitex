"use client";

import { useState } from "react";
import { servicesData } from "@/data/servicesData";
import Link from "next/link";

interface InteractiveCalculatorProps {
  initialSlug?: string;
}

export default function InteractiveCalculator({ initialSlug }: InteractiveCalculatorProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialSlug || servicesData[0].slug
  );
  const [widthMeters, setWidthMeters] = useState<number>(2);
  const [heightMeters, setHeightMeters] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [includeLamination, setIncludeLamination] = useState<boolean>(true);

  const currentService = servicesData.find((s) => s.slug === selectedSlug) || servicesData[0];

  // Price Calculation Logic
  const totalSquareMeters = Number((widthMeters * heightMeters * quantity).toFixed(2));
  const laminationCostPerM2 = includeLamination ? 35 : 0;
  const basePricePerM2 = currentService.unitPriceEstimate + laminationCostPerM2;
  const estimatedTotalPrice = Math.round(totalSquareMeters * basePricePerM2);

  return (
    <div className="card-token p-6 sm:p-8 bg-white-token space-y-6">
      <div className="flex items-center justify-between border-b border-token pb-4 flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 label-mono-token">
            <span className="reg-cross-token" aria-hidden />
            Otomatik Hesaplama Matriksi
          </div>
          <h3 className="font-display text-xl font-extrabold text-main-token">Canlı Baskı Fiyat Hesaplayıcı</h3>
        </div>
        <span className="badge-cyan-token">ANINDA TAHMİN</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="space-y-4">
          <div>
            <label className="form-label-token">01 · Baskı / Reklam Hizmet Türü</label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="input-token font-medium"
            >
              {servicesData.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.codeNumber}. {service.title} ({service.unitPriceEstimate} TL/m²)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label-token">En (Metre)</label>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.1"
                value={widthMeters}
                onChange={(e) => setWidthMeters(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="input-token font-mono"
              />
            </div>

            <div>
              <label className="form-label-token">Boy (Metre)</label>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.1"
                value={heightMeters}
                onChange={(e) => setHeightMeters(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="input-token font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <label className="form-label-token">Adet / Miktar</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="input-token font-mono"
              />
            </div>

            <div className="pt-7">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-main-token">
                <input
                  type="checkbox"
                  checked={includeLamination}
                  onChange={(e) => setIncludeLamination(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-token"
                />
                Laminasyon Koruma (+35 TL/m²)
              </label>
            </div>
          </div>
        </div>

        {/* Real-time Calculation Result Box */}
        <div className="bg-navy-gradient-token p-6 rounded-xl flex flex-col justify-between space-y-5 relative overflow-hidden">
          <span className="reg-cross-navy-token absolute top-4 right-4" aria-hidden />
          <div className="space-y-3">
            <div className="label-mono-navy-token">Hesaplama Özeti</div>
            <div className="flex justify-between text-sm text-on-navy-muted border-b border-on-navy-token pb-2">
              <span>Seçilen Hizmet</span>
              <span className="font-semibold text-on-navy-token text-right">{currentService.title}</span>
            </div>
            <div className="flex justify-between text-sm text-on-navy-muted border-b border-on-navy-token pb-2">
              <span>Toplam Alan</span>
              <span className="font-mono text-on-navy-token">{totalSquareMeters} m²</span>
            </div>
            <div className="flex justify-between text-sm text-on-navy-muted border-b border-on-navy-token pb-2">
              <span>Birim Fiyat</span>
              <span className="font-mono text-on-navy-token">{basePricePerM2} TL / m²</span>
            </div>
          </div>

          <div>
            <div className="label-mono-navy-token">Tahmini Toplam (KDV Hariç)</div>
            <div className="font-mono text-4xl font-semibold text-brand-token tracking-tight mt-1">
              ₺{estimatedTotalPrice.toLocaleString("tr-TR")}
              <span className="text-xs text-on-navy-muted font-normal ml-1">TL</span>
            </div>
          </div>

          <Link
            href={`/iletisim?service=${selectedSlug}&w=${widthMeters}&h=${heightMeters}&q=${quantity}&price=${estimatedTotalPrice}`}
            className="btn-primary-token w-full justify-center py-3 text-sm"
          >
            Bu Teklifi Resmi Talebe Dönüştür →
          </Link>
        </div>
      </div>
    </div>
  );
}
