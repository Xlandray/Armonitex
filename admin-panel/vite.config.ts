import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Cloudflare Access bu host'a erisimi zaten kapiliyor; dev sunucusu
    // tunel uzerinden gelen public Host header'ini kabul etmeli.
    allowedHosts: ["armonitex-admin.ataci.com.tr", "localhost"],
  },
});
