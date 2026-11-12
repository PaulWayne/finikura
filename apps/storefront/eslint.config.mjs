import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Colours only through the charter tokens (brand-*), never a raw hex code (FK-12).
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/layout/Logo.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/#[0-9A-Fa-f]{6}\\b/]",
          message: "Couleur en dur interdite : utilisez un token de la charte (bg-brand-*, text-brand-*).",
        },
        {
          selector: "Literal[value=/\\b(bg|text|border|ring|fill|stroke|from|to|via)-(white|black|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|green|emerald|teal|sky|blue|indigo|purple|pink|rose)(-\\d+)?\\b/]",
          message: "Couleur Tailwind par défaut interdite : utilisez un token de la charte (brand-*).",
        },
        {
          selector: "TemplateElement[value.raw=/#[0-9A-Fa-f]{6}\\b/]",
          message: "Couleur en dur interdite : utilisez un token de la charte (bg-brand-*, text-brand-*).",
        },
        {
          selector: "Literal[value=/text-brand-text\\/[1-8]0\\b/]",
          message: "Texte en opacité réduite interdit (contraste AA) : utilisez text-brand-text.",
        },
        {
          selector: "TemplateElement[value.raw=/text-brand-text\\/[1-8]0\\b/]",
          message: "Texte en opacité réduite interdit (contraste AA) : utilisez text-brand-text.",
        },
        {
          selector: "Literal[value=/^(?!.*focus-visible:).*outline-none/]",
          message: "outline-none sans style focus-visible: rend le focus clavier invisible.",
        },
        {
          selector: "TemplateElement[value.raw=/^(?!.*focus-visible:).*outline-none/]",
          message: "outline-none sans style focus-visible: rend le focus clavier invisible.",
        },
      ],
    },
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
