// ADR 0007: tum renk/stil `src/app/globals.css` icindeki semantik token
// siniflari uzerinden gecer. Bu yasak simdiye kadar yalnizca AGENTS.md ve
// CLAUDE.md'de yaziyordu; elle taranmadikca ihlaller fark edilmiyordu. Kural
// onu lint zamanina tasir.
//
// Tarama dosya genelindedir (yalnizca className degil), cunku sinif metinleri
// bazen degiskenlerde/dizilerde tutuluyor. Kaliplar dar oldugu icin yanlis
// pozitif beklenmez; cikarsa `eslint-disable-next-line` ile susturulabilir —
// bu da gorunur ve gozden gecirilebilir bir istisna olur.

const PREFIX =
  "bg|text|border|from|to|via|ring|fill|stroke|decoration|outline|shadow|accent|caret|divide|placeholder";

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";

const CHECKS = [
  {
    // bg-slate-900, text-cyan-100, border-gray-200 ...
    messageId: "adhocPalette",
    pattern: new RegExp(`\\b(?:${PREFIX})-(?:${PALETTE})-\\d+\\b`),
  },
  {
    // bg-white / text-black gibi ciplak renkler.
    // `.bg-white-token` mesru oldugu icin -token soneki disarida birakilir.
    messageId: "adhocPalette",
    pattern: new RegExp(`\\b(?:${PREFIX})-(?:white|black)\\b(?!-token)`),
  },
  {
    // bg-[#fff], text-[#0a2540]
    messageId: "arbitraryColor",
    pattern: /\b[a-z-]+-\[#[0-9a-fA-F]{3,8}\]/,
  },
  {
    // bg-[var(--color-primary)] — token sinifi yerine degiskene dogrudan erisim
    messageId: "arbitraryVar",
    pattern: /\b[a-z-]+-\[var\([^)]*\)\]/,
  },
  {
    // bg-white-token/10 — token siniflari Tailwind renk utility'si OLMADIGI
    // icin opaklik modifikatoru hata vermez, sadece hicbir sey yapmaz.
    messageId: "tokenOpacity",
    pattern: /\b[a-z-]+-token\/\d+/,
  },
];

const noAdhocColor = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ad-hoc renk/stil yerine globals.css'teki semantik token siniflarini zorunlu kilar (ADR 0007).",
    },
    schema: [],
    messages: {
      adhocPalette:
        "Ad-hoc renk sinifi: '{{match}}'. globals.css'teki token sinifini kullan (ADR 0007).",
      arbitraryColor:
        "Arbitrary renk degeri: '{{match}}'. Once globals.css'e semantik bir token tanimla (ADR 0007).",
      arbitraryVar:
        "Arbitrary CSS degiskeni: '{{match}}'. Degiskene dogrudan degil, token sinifi uzerinden eris (ADR 0007).",
      tokenOpacity:
        "Token sinifina opaklik modifikatoru sessizce calismaz: '{{match}}'. globals.css'e ayri bir token sinifi ekle.",
    },
  },
  create(context) {
    const check = (node, raw) => {
      if (typeof raw !== "string" || raw.length === 0) return;
      for (const { pattern, messageId } of CHECKS) {
        const match = pattern.exec(raw);
        if (match) {
          context.report({ node, messageId, data: { match: match[0] } });
          return;
        }
      }
    };

    return {
      Literal(node) {
        if (typeof node.value === "string") check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
    };
  },
};

const designTokensPlugin = {
  rules: { "no-adhoc-color": noAdhocColor },
};

export default designTokensPlugin;
