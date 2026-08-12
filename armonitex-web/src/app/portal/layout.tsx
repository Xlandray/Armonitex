import Link from "next/link";
import { redirect } from "next/navigation";

import Logo from "@/components/Logo";
import { serverGet, UnauthorizedError } from "@/lib/serverApi";
import LogoutButton from "./LogoutButton";

type Me = { full_name: string | null; email: string };

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  let me: Me;
  try {
    me = await serverGet<Me>("/portal/me");
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/auth/login?next=/portal");
    throw error;
  }

  return (
    <div className="min-h-screen bg-paper-token text-main-token font-sans">
      <header className="bg-white-token border-b border-token">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/portal" className="flex items-center gap-3">
            <Logo className="h-8" />
            <span className="eyebrow-token">Müşteri Portalı</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-token">{me.full_name ?? me.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
