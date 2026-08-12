"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <button onClick={logout} disabled={busy} className="btn-secondary-token">
      {busy ? "Çıkış yapılıyor..." : "Çıkış"}
    </button>
  );
}
