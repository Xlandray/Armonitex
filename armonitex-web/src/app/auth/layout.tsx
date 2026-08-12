import Link from "next/link";
import Logo from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper-token flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-main-token">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <Link href="/" className="flex justify-center">
          <Logo className="h-12" />
        </Link>
        <p className="eyebrow-token">Müşteri Portalı</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-token bg-white-token py-8 px-6 sm:px-10">{children}</div>
      </div>
    </div>
  );
}
