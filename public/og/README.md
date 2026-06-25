# Open Graph share cards (`/public/og`)

Every page has its **own** OG/Twitter share image. The route's `head()` passes an
`image:` path into `seo()` ([src/lib/seo.ts](../../src/lib/seo.ts)), which emits
`og:image` + `twitter:image`. The files in this folder are **GPT-image-1 cards**
(generated via ChatGPT in the Clay design system, then cropped to 1200×630).
To swap any of them, drop a new file **in place** (same filename, same size) and
the meta tags update automatically — no code change needed.

## Hard requirements for every replacement

| Rule        | Value |
|-------------|-------|
| Dimensions  | **1200 × 630 px** (exact) — this is declared in `siteConfig.ogImageWidth/Height`; a different size means editing [src/lib/site-config.ts](../../src/lib/site-config.ts). |
| Format      | `.png` (or `.jpg`, but keep the `.png` filename the route expects). |
| File size   | Keep **< 1 MB** (LinkedIn/WhatsApp choke above ~5 MB; smaller = faster un-crawled previews). |
| Safe zone   | Keep logo/title within the central area, ~**80 px margin** all sides — some apps crop to ~1.91:1 and round the corners. |

After replacing files, validate with the
[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/),
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/), and
X's card validator (they cache aggressively — re-scrape to bust the cache).

## Filename → page map

| File | Page / URL | Title to render | Accent |
|------|------------|-----------------|--------|
| `../og-image.png` *(parent folder, global default)* | **Home** `/` + any fallback | Finaccru Infotech | peach |
| `services.png` | `/services` | What we build | peach `#ffb084` |
| `services/ai-ml-development.png` | `/services/ai-ml-development` | AI & ML Development | lavender `#b8a4ed` |
| `services/hire-developers.png` | `/services/hire-developers` | Hire Developers | ochre `#e8b94a` |
| `services/mobile-app-development.png` | `/services/mobile-app-development` | Mobile App Development | mint `#a4d4c5` |
| `services/cybersecurity-services.png` | `/services/cybersecurity-services` | Cybersecurity Services | coral `#ff6b5a` |
| `about.png` | `/about` | About Finaccru | teal `#1a3a3a` |
| `contact.png` | `/contact` | Contact us | pink `#ff4d8b` |
| `pricing.png` | `/pricing` | Engagement models | ochre `#e8b94a` |
| `blog.png` | `/blog` | Blog | lavender `#b8a4ed` |
| `privacy.png` | `/privacy` | Privacy Policy | grey `#6a6a6a` |
| `terms.png` | `/terms` | Terms of Service | grey `#6a6a6a` |
| `cookies.png` | `/cookies` | Cookie Policy | peach `#ffb084` |
| `sitemap.png` | `/sitemap` | Sitemap | mint `#a4d4c5` |

> Blog **articles** (`/article/<slug>`) already use each post's Sanity cover image
> automatically — no files needed here.

## Brand palette (Clay design system — `tailwind.config.js`)

- **Canvas / background:** cream `#fffaf0`
- **Ink / text:** near-black `#0a0a0a`, muted text `#6a6a6a`
- **Accents:** pink `#ff4d8b` · teal `#1a3a3a` · lavender `#b8a4ed` · peach `#ffb084` · ochre `#e8b94a` · mint `#a4d4c5` · coral `#ff6b5a`
- **Type feel:** Inter, weight 500–700, tight negative letter-spacing on headlines, warm and minimal, lots of negative space, soft rounded shapes, one subtle shadow.

## GPT-image-1 prompts

Reusable style preamble (prepend to every prompt):

> A premium, minimal 1200×630 social share card for a software company.
> Warm "Clay" design system: cream `#fffaf0` background, near-black `#0a0a0a`
> text, generous negative space, soft rounded pastel accent shapes, subtle depth,
> editorial SaaS aesthetic, clean geometric sans-serif (Inter-like). Wordmark
> "Finaccru Infotech" small in the top-left. Flat vector, no photo, no clutter,
> no borders bleeding off-frame. Render text crisply and spelled exactly as given.

Per page — append the line for the card you're generating:

- **services.png** — Headline "What we build". Accent **peach `#ffb084`**. Abstract motif: stacked building blocks / modular tiles.
- **ai-ml-development.png** — Headline "AI & ML Development". Accent **lavender `#b8a4ed`**. Motif: soft neural-network nodes / orbiting particles.
- **hire-developers.png** — Headline "Hire Developers". Accent **ochre `#e8b94a`**. Motif: friendly developer avatars / code brackets.
- **mobile-app-development.png** — Headline "Mobile App Development". Accent **mint `#a4d4c5`**. Motif: rounded phone silhouette / app tiles.
- **cybersecurity-services.png** — Headline "Cybersecurity Services". Accent **coral `#ff6b5a`**. Motif: shield / lock / radar sweep.
- **about.png** — Headline "About Finaccru". Accent **teal `#1a3a3a`**. Motif: abstract team / connected dots, Dubai skyline hint.
- **contact.png** — Headline "Contact us". Accent **pink `#ff4d8b`**. Motif: speech bubble / paper-plane.
- **pricing.png** — Headline "Engagement models". Accent **ochre `#e8b94a`**. Motif: three stacked plan cards / layered panels.
- **blog.png** — Headline "Blog". Accent **lavender `#b8a4ed`**. Motif: editorial article lines / pen.
- **privacy.png** — Headline "Privacy Policy". Accent **grey `#6a6a6a`**. Motif: shield / document, restrained and formal.
- **terms.png** — Headline "Terms of Service". Accent **grey `#6a6a6a`**. Motif: document with checkmarks, restrained and formal.
- **cookies.png** — Headline "Cookie Policy". Accent **peach `#ffb084`**. Motif: cookie / toggle switches, light and friendly.
- **sitemap.png** — Headline "Sitemap". Accent **mint `#a4d4c5`**. Motif: connected node tree / index grid.

> Tip: gpt-image-1 can garble long text. If a headline comes out misspelled,
> regenerate the card **without text** (background art only) and ask for it — these
> placeholders already carry correct text, so a clean background swap also works.

## Regenerating

The current cards were generated with **GPT-image-1 via ChatGPT** using the prompts
above, then center-cropped from 1536×941 to 1200×630. To redo one: generate a new
wide card from its prompt, export it, and overwrite the matching file (keep 1200×630).

A standalone branded-card fallback also exists (`gen.mjs`, sharp-based SVG→PNG, kept
in the session scratchpad — **not** a project dependency) if you ever want clean
text-only cards without AI.
