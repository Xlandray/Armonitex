"use client";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-12 w-auto" }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      {/* UPDATE Badge - Magenta */}
      <div className="bg-[#961358] text-white px-3 py-1.5 rounded-l-md shadow-xs flex flex-col justify-center items-start">
        <span className="text-base font-black tracking-tight leading-none uppercase">UPDATE</span>
        <span className="text-[9px] font-bold text-pink-100 tracking-tighter uppercase leading-tight mt-0.5">
          Açıkhava Çözümleri
        </span>
      </div>

      {/* ARMONITEX Badge - Cyan/Turquoise */}
      <div className="bg-[#00A699] text-white px-3.5 py-1.5 rounded-r-md shadow-xs flex flex-col justify-center items-start">
        <span className="text-base font-black tracking-tight leading-none uppercase">ARMONİTEX</span>
        <span className="text-[9px] font-bold text-cyan-100 tracking-tighter uppercase leading-tight mt-0.5">
          Indoor & Outdoor Printing
        </span>
      </div>
    </div>
  );
}
