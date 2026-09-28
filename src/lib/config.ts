import { z } from "zod";
import rawConfig from "../../kansquares.config.json";
import { themeNames } from "./themes";

// --- schema -----------------------------------------------------------
// This is the one contract every Kansquares site edits against. Keep it in
// sync with the config reference in README.md when you change it.

const linkSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});

const itemSchema = z.object({
  title: z.string().min(1),
  /** Short punchy tagline, shown under the title when theme.showHeadingUnderImage is true. */
  heading: z.string().optional(),
  /** One or two sentences, shown alongside `heading` under the same toggle. */
  description: z.string().optional(),
  /** Path to the cover image, usually something under /covers/. */
  image: z.string().min(1),
  /** Required — never falls back to a blank alt. Describe the image, not just repeat the title. */
  imageAlt: z.string().min(1),
  url: z.url(),
});

const sectionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  items: z.array(itemSchema).min(1),
});

// Zod 4 requires a `.default(...)` on an object schema to match that
// object's full *output* shape — it won't cascade from the inner fields'
// own defaults the way `.default({})` did in Zod 3 — so both of these
// spell out the whole default shape explicitly rather than relying on `{}`.
const columnsSchema = z
  .object({
    mobile: z.number().int().min(1).max(6).default(2),
    tablet: z.number().int().min(1).max(6).default(2),
    desktop: z.number().int().min(1).max(6).default(3),
    wide: z.number().int().min(1).max(8).default(4),
  })
  .default({ mobile: 2, tablet: 2, desktop: 3, wide: 4 });

const configSchema = z.object({
  site: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    url: z.url(),
    ogImage: z.string().optional(),
    favicon: z.string().default("/favicon.svg"),
    /**
     * Raw HTML allowed (it's your own config file, not user input).
     * Set to an empty string to remove the footer entirely.
     */
    footer: z
      .string()
      .default('Built with <a href="https://github.com/bilarikan/astro-theme-kansquares">Kansquares</a>.'),
  }),
  nav: z.array(linkSchema).default([]),
  theme: z
    .object({
      preset: z.enum(themeNames).default("tray"),
      columns: columnsSchema,
      showHeadingUnderImage: z.boolean().default(true),
    })
    .default({ preset: "tray", columns: { mobile: 2, tablet: 2, desktop: 3, wide: 4 }, showHeadingUnderImage: true }),
  sections: z.array(sectionSchema).min(1),
});

export type KansquaresConfig = z.infer<typeof configSchema>;
export type ConfigItem = KansquaresConfig["sections"][number]["items"][number];
export type ConfigLink = KansquaresConfig["nav"][number];

function loadConfig(): KansquaresConfig {
  const result = configSchema.safeParse(rawConfig);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `kansquares.config.json is invalid — fix the following and rebuild:\n${issues}\n`,
    );
  }
  return result.data;
}

const config = loadConfig();
export default config;
