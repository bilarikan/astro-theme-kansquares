import { readFileSync } from "node:fs";
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Read with plain fs + JSON.parse rather than a JSON import — this file is
// loaded directly by Node before Vite is involved, and we'd rather not
// depend on import-attribute syntax support here.
const siteConfig = JSON.parse(
  readFileSync(new URL("./kansquares.config.json", import.meta.url)),
);

export default defineConfig({
  site: siteConfig.site?.url,
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      // Only the Tray preset (the default) actually uses this today, but it
      // costs nothing to have available — presets that don't reference
      // var(--font-fredoka) just never load it.
      provider: fontProviders.google(),
      name: "Fredoka",
      cssVariable: "--font-fredoka",
      weights: [400, 500, 600, 700],
    },
  ],
});
