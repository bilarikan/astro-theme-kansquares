# Kansquares

A free, open-source [Astro](https://astro.build) theme for a single-page
project-curation site — a grid of games, apps, and projects you've made, each
linking out to where it actually lives. Inspired by the layout of
[john.fun](https://john.fun), architected for config-only customization the
way [OpenLinks](https://github.com/E10YDEV/OpenLinks) is.

Everything you'd normally touch — content, columns, header links, visual
style — lives in one file: **`kansquares.config.json`**. No component edits
needed for normal use.

## Quickstart

```bash
npm create astro@latest -- --template bilarikan/astro-theme-kansquares
cd your-project-name
npm install
npm run dev
```

Then open `kansquares.config.json` and replace the example content with your
own. `npm run build` produces a static site in `dist/`, deployable anywhere
that serves static files (see [Deploying](#deploying) below).

## Config reference

```jsonc
{
  "site": {
    "title": "Your Name",
    "description": "A collection of games, tools, and other fun things.",
    "url": "https://example.com",
    "ogImage": "/covers/example-three.svg", // optional
    "favicon": "/favicon.svg", // optional, defaults to this
    "footer": "Built with <a href=\"...\">Kansquares</a>." // optional, raw HTML; "" removes it
  },
  "nav": [
    // any number of these, in any order — this is your header/top links row
    { "label": "Blog", "url": "https://example.com/blog" }
  ],
  "theme": {
    "preset": "tray", // see Presets below
    "columns": { "mobile": 2, "tablet": 2, "desktop": 3, "wide": 4 },
    "showHeadingUnderImage": true // false hides `heading` and `description` on every card
  },
  "sections": [
    {
      "id": "fun", // used for the section's anchor id — keep it URL-safe
      "label": "Fun", // the visible heading
      "items": [
        {
          "title": "Eyes Front!", // required
          "heading": "Nine students. One whistle.", // optional short tagline
          "description": "One or two sentences.", // optional
          "image": "/covers/eyes-front.png", // required — usually something under public/covers/
          "imageAlt": "Describe the image, not just the title", // required — never falls back to blank
          "url": "https://bilarikan.itch.io/eyes-front" // required
        }
      ]
    }
  ]
}
```

The config is validated at build time (via [Zod](https://zod.dev)) — a typo
or missing required field fails the build with a specific, readable error
instead of shipping a broken page.

### Adding content

- **A new item**: add an object to an existing section's `items` array.
- **A new section**: add an object to the top-level `sections` array with its
  own `id`, `label`, and `items`.
- **Cover images**: drop the file in `public/covers/` and reference it by
  path (e.g. `/covers/your-image.png`). Any static image format works; there's
  no build-time image processing, so pre-size/compress images yourself before
  adding them — a 1.9:1 aspect ratio (matching the built-in example covers)
  looks best in every preset except Squares, which is 1:1.

## Presets

Set `theme.preset` to any of these. All eight ship in every install, all get
automatic light/dark variants from `prefers-color-scheme` (no manual toggle),
and all read the same config — switching preset is a one-line change.

| Preset | Look |
|---|---|
| `tray` *(default)* | Warm paper palette (lifted from a real token set), heading + description shown under each card. |
| `poster` | Faithful to john.fun: huge centered wordmark, image-only cards, nothing captioned underneath. |
| `brutalist` | High-contrast, monospace, hard edges, thick borders, inverts on hover. |
| `squares` | Literal 1:1 square cards in a tighter grid, instead of wide rectangles. |
| `zine` | Cut-and-paste scrapbook feel — tilted, tape-bordered cards on newsprint. |
| `editorial` | Structurally different from the rest: a magazine-style list (thumbnail, serif title, one line) instead of a tile grid. |
| `terminal` | Phosphor green on black, window-chrome dots, dashed borders. Deliberately has no light mode. |
| `blueprint` | Drafting-sheet blue, monospace labels, dashed sheet edge. |

Only `poster` (image-only) and `editorial` (list instead of grid) change the
actual markup; the rest are pure CSS swaps of the same components — see
`src/styles/presets.css`.

## Deploying

`npm run build` outputs a fully static site to `dist/`. A few notes if you're
deploying to shared/Apache-style hosting (e.g. Namecheap + cPanel), rather
than a git-integrated host like Netlify/Vercel/Cloudflare Pages:

1. Upload the **contents** of `dist/` into `public_html/` (or a subfolder, if
   the site isn't living at the domain root) — not the `dist` folder itself.
   `public_html/index.html` should exist afterward.
2. Astro emits `404.html` at the build root rather than wiring up a
   server-level 404 route. Add this to your `.htaccess`:
   ```
   ErrorDocument 404 /404.html
   ```

For Netlify/Vercel/Cloudflare Pages: point the build command at `npm run
build` and the output directory at `dist` — no extra config needed.

## Architecture, if you're extending this

- `kansquares.config.json` is read and validated once, in `src/lib/config.ts`.
  Every component imports the typed, already-validated config from there —
  nothing else touches the raw JSON.
- `src/lib/themes.ts` is the single source of truth for which presets exist
  (`themeNames`) and their structural quirks (`themeMeta` — currently just
  "does this preset use a list layout" and "does this preset hide all text
  and rely on the image alone"). Adding a ninth preset means adding it here
  *and* adding a matching `[data-preset="..."]` block to
  `src/styles/presets.css` — nothing else needs to change.
- Colors, fonts, radii and borders are all CSS custom properties
  (`--kq-*`, defined in `src/styles/tokens.css`) that `presets.css`
  overrides per preset. Components never hardcode a color — they only ever
  read a `--kq-*` variable — which is what lets one set of markup produce
  eight very different looks.
- The one genuine layout fork is Editorial's row list vs. everyone else's
  tile grid, handled in `Section.astro`/`Card.astro` via
  `themeMeta[preset].listLayout`.

## License

MIT — see [LICENSE](LICENSE). Fork it, rename it, ship it.
