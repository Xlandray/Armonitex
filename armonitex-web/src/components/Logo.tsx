"use client";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-12 w-auto" }: LogoProps) {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* UPDATE Badge - Magenta */}
      <div className="bg-brand-magenta-token text-white-token px-3 py-1.5 rounded-l-md flex flex-col justify-center items-start">
        <span className="text-base font-extrabold tracking-tight leading-none uppercase">UPDATE</span>
        <span className="text-[8px] font-medium text-on-brand-soft-token tracking-tight uppercase leading-tight mt-0.5">
          Açıkhava Çözümleri
        </span>
      </div>

      {/* ARMONITEX Badge - Cyan/Turquoise */}
      <div className="bg-brand-token text-white-token px-3.5 py-1.5 rounded-r-md flex flex-col justify-center items-start">
        <span className="text-base font-extrabold tracking-tight leading-none uppercase">ARMONİTEX</span>
        <span className="text-[8px] font-medium text-on-brand-soft-token tracking-tight uppercase leading-tight mt-0.5">
          Indoor &amp; Outdoor Printing
        </span>
      </div>
    </div>
  );
}
