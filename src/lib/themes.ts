// The full list of built-in Kansquares presets. This is the single source of
// truth for valid `theme.preset` values — the config schema (config.ts)
// derives its Zod enum from this array, so adding a preset here plus a
// matching `[data-preset="..."]` block in src/styles/presets.css is enough
// to wire up a new one end to end.
export const themeNames = [
  "tray",
  "poster",
  "brutalist",
  "squares",
  "zine",
  "editorial",
  "terminal",
  "blueprint",
] as const;

export type ThemeName = (typeof themeNames)[number];

export interface ThemeMeta {
  /** Shown nowhere in the UI yet, but handy for docs/tooling. */
  label: string;
  /** One line describing the visual idea, for the README table. */
  description: string;
  /**
   * When true, Section/Card render a stacked list (thumbnail + text row)
   * instead of the default image-tile grid. Only Editorial uses this today,
   * but any future preset can opt in the same way.
   */
  listLayout: boolean;
  /**
   * When true, Card renders the image only — no title/heading/description
   * text — on the assumption the cover image itself carries the title
   * (john.fun's own convention). The title is still exposed as the link's
   * accessible name.
   */
  imageOnly: boolean;
}

export const themeMeta: Record<ThemeName, ThemeMeta> = {
  tray: {
    label: "Tray",
    description: "Warm paper palette, heading + description shown under each card. The default.",
    listLayout: false,
    imageOnly: false,
  },
  poster: {
    label: "Poster",
    description: "Faithful to john.fun: huge wordmark, image-only cards, nothing captioned underneath.",
    listLayout: false,
    imageOnly: true,
  },
  brutalist: {
    label: "Brutalist",
    description: "High-contrast, monospace, hard edges, thick borders, inverts on hover.",
    listLayout: false,
    imageOnly: false,
  },
  squares: {
    label: "Squares",
    description: "Literal 1:1 square cards in a tighter grid, instead of wide rectangles.",
    listLayout: false,
    imageOnly: false,
  },
  zine: {
    label: "Zine",
    description: "Cut-and-paste scrapbook feel — tilted, tape-bordered cards on newsprint.",
    listLayout: false,
    imageOnly: false,
  },
  editorial: {
    label: "Editorial",
    description: "A magazine-style list instead of a grid: thumbnail, serif title, one line.",
    listLayout: true,
    imageOnly: false,
  },
  terminal: {
    label: "Terminal",
    description: "Phosphor green on black, window-chrome dots, dashed ASCII-style borders.",
    listLayout: false,
    imageOnly: false,
  },
  blueprint: {
    label: "Blueprint",
    description: "Drafting-sheet blue, monospace labels, dashed sheet edge.",
    listLayout: false,
    imageOnly: false,
  },
};
