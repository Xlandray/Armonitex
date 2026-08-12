import Link from "next/link";
import Logo from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-paper-token bg-grid-token flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-main-token">
      <span className="reg-cross-token absolute top-8 left-8 hidden sm:block" aria-hidden />
      <span className="reg-cross-token absolute bottom-8 right-8 hidden sm:block" aria-hidden />

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        <Link href="/" className="flex justify-center">
          <Logo className="h-12" />
        </Link>
        <div className="flex items-center justify-center gap-2 label-mono-token">
          <span className="reg-cross-token" aria-hidden />
          Müşteri Portalı
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-token bg-white-token py-8 px-6 sm:px-10">{children}</div>
      </div>
    </div>
  );
}
