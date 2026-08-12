import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import designTokens from "./eslint-rules/design-tokens.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // ADR 0007: renk/stil yalnizca globals.css'teki semantik token siniflari
  // uzerinden. Yasak simdiye kadar sadece AGENTS.md'de yaziyordu; artik lint
  // zamaninda uygulaniyor. Yalnizca kaynak dosyalar taranir.
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    plugins: { "design-tokens": designTokens },
    rules: { "design-tokens/no-adhoc-color": "error" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
