// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://turrika.vercel.app",

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Unbounded",
      cssVariable: "--font-unbounded",
      styles: ["normal"],
      weights: [300, 400, 500, 600, 700],
      display: "swap",
      subsets: ["latin"],
      formats: ["woff2"],
      fallbacks: ["cursive", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Poppins",
      cssVariable: "--font-poppins",
      styles: ["normal"],
      weights: [400, 600],
      display: "swap",
      subsets: ["latin"],
      formats: ["woff2"],
      fallbacks: ["sans-serif", "system-ui"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
