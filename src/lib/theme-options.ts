import type { AccentTheme } from '@/lib/site-content'

// Accent-theme options — the configuration layer of the reference architecture's
// accent-theme system, mirrored here as a labelled {key,label} list.
//
// The reference ships six switchable accents wired end-to-end through CSS
// variables + a ColorThemeProvider + localStorage + a switcher UI. Finaccru's
// design system (design.md) deliberately defines ONE brand accent — Action Blue
// (#0066cc) — and the same hex is baked into ~8 decorative components and
// index.css. A live multi-accent switcher is therefore intentionally NOT wired:
// it would (a) desync those inline-hex sites, (b) break the `primary/<alpha>`
// opacity utilities (e.g. bg-primary/10) because Finaccru runs the Tailwind v4
// `@config` legacy bridge where a CSS-var-backed token can't take an opacity
// modifier, and (c) contradict design.md.
//
// To add a switchable accent later: extend AccentTheme in site-content.ts, add
// an entry below, add a `:root[data-theme-color="KEY"]` (+ `.dark[...]`) CSS
// override block, mount a ColorThemeProvider that toggles the html data
// attribute + persists to localStorage, add the pre-paint anti-flicker script,
// and migrate the inline-hex sites to the same CSS vars.
export const ACCENT_THEME_OPTIONS: { key: AccentTheme; label: string }[] = [
  { key: 'finaccru', label: 'Finaccru' },
]
