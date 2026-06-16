import type { ReactElement } from 'react'

// Minimal, stroke-based icon set. 1.6px strokes echo the design's hairline restraint.
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function Icon({
  name,
  className = '',
  size = 24,
}: {
  name: string
  className?: string
  size?: number
}) {
  const paths = GLYPHS[name as IconName] ?? GLYPHS.spark
  return (
    <svg {...base} width={size} height={size} className={className} aria-hidden="true">
      {paths}
    </svg>
  )
}

export type IconName = keyof typeof GLYPHS

const GLYPHS = {
  code: (
    <>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 6-3 12" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1 .5 6.96" />
      <path d="M8 18h9" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.2" />
      <path d="M11 18h2" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6.5 6.5 2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.2-3.6" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
    </>
  ),
  arrow: <path d="M5 12h13M13 6l6 6-6 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,

  // ── Sub-service glyphs (protechplanner service catalogue) ──────────────
  network: (
    <>
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="5" cy="6" r="1.7" />
      <circle cx="19" cy="6" r="1.7" />
      <circle cx="12" cy="20" r="1.7" />
      <path d="m10.3 10.6-3.9-3.2M13.7 10.6l3.9-3.2M12 14.4v3.9" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </>
  ),
  chat: (
    <>
      <path d="M20 14a2 2 0 0 1-2 2H9l-4 3v-3H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7Z" />
      <path d="M8.5 9.5h7M8.5 12h4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  chart: (
    <>
      <path d="m4 15 5-5 3 3 7-7" />
      <path d="M16 6h4v4" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.7L12 12.4 3.5 7.7 12 3Z" />
      <path d="m3.5 12 8.5 4.7 8.5-4.7" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="7" rx="1.6" />
      <rect x="4" y="13" width="16" height="7" rx="1.6" />
      <path d="M7.5 7.5h.01M7.5 16.5h.01" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <path d="M3.5 12.5h17" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.8-1.9 0-.5-.2-.9-.5-1.2-.3-.4-.5-.8-.5-1.2 0-1 .8-1.7 1.8-1.7H16a5 5 0 0 0 5-5c0-4-4-6.7-9-6.7Z" />
      <circle cx="7.6" cy="11.6" r=".9" />
      <circle cx="10.6" cy="7.8" r=".9" />
      <circle cx="15" cy="8.6" r=".9" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
    </>
  ),
  braces: (
    <>
      <path d="M8.5 4c-1.8 0-2.3 1.4-2.3 3.3S5.7 11 4.3 12c1.4 1 1.9 2.4 1.9 4.4S6.7 20 8.5 20" />
      <path d="M15.5 4c1.8 0 2.3 1.4 2.3 3.3S18.3 11 19.7 12c-1.4 1-1.9 2.4-1.9 4.4S17.3 20 15.5 20" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.5 20h19L12 4Z" />
      <path d="M12 10v4.2M12 17.2h.01" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5.5" y="4.5" width="13" height="16" rx="2" />
      <rect x="9" y="3" width="6" height="3.5" rx="1" />
      <path d="M9 11h6M9 14.5h6M9 18h3.5" />
    </>
  ),
} satisfies Record<string, ReactElement>
