import type { ReactNode, MouseEventHandler } from 'react'
import { Link } from '@tanstack/react-router'
import { Icon } from '@/components/ui/Icons'

type Width = 'wide' | 'content'
type Surface = 'light' | 'parchment' | 'dark' | 'dark2' | 'dark3'
type ButtonVariant = 'primary' | 'ghost' | 'ghostDark' | 'darkUtility'

// ── Container ──────────────────────────────────────────────────────────
// Centered max-width wrapper. `width` picks the design.md content widths.
export function Container({
  children,
  width = 'wide',
  className = '',
}: {
  children: ReactNode
  width?: Width
  className?: string
}) {
  const w = width === 'content' ? 'max-w-content' : 'max-w-wide'
  return <div className={`mx-auto w-full ${w} px-6 sm:px-10 ${className}`}>{children}</div>
}

// ── Section ────────────────────────────────────────────────────────────
// A full-bleed tile. The surface color IS the divider — no borders, no shadows.
const SURFACES: Record<Surface, string> = {
  light: 'bg-canvas text-ink',
  parchment: 'bg-parchment text-ink',
  dark: 'bg-tile1 text-white',
  dark2: 'bg-tile2 text-white',
  dark3: 'bg-tile3 text-white',
}

export function Section({
  surface = 'light',
  children,
  className = '',
  width = 'wide',
  id,
}: {
  surface?: Surface
  children: ReactNode
  className?: string
  width?: Width
  id?: string
}) {
  return (
    <section id={id} className={`${SURFACES[surface]} ${className}`}>
      <Container width={width} className="py-20 sm:py-32">
        {children}
      </Container>
    </section>
  )
}

// ── Eyebrow ────────────────────────────────────────────────────────────
// Small caption-strong label above a headline. Accent on light, sky on dark.
export function Eyebrow({
  children,
  onDark = false,
  className = '',
}: {
  children: ReactNode
  onDark?: boolean
  className?: string
}) {
  return (
    <p
      className={`label-caps text-[12px] tracking-[0.16em] ${
        onDark ? 'text-primary-ondark' : 'text-primary'
      } ${className}`}
    >
      {children}
    </p>
  )
}

// ── Button ─────────────────────────────────────────────────────────────
// Two grammars only: blue pill (primary) and ghost pill (secondary).
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white border border-transparent hover:bg-primary-focus',
  ghost:
    'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white',
  ghostDark:
    'bg-transparent text-primary-ondark border border-primary-ondark/60 hover:border-primary-ondark',
  darkUtility:
    'bg-ink text-white rounded-sm hover:bg-black',
}

export function Button({
  children,
  variant = 'primary',
  to,
  href,
  type,
  onClick,
  size = 'md',
  className = '',
  icon = false,
}: {
  children: ReactNode
  variant?: ButtonVariant
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLElement>
  size?: 'md' | 'lg'
  className?: string
  icon?: boolean
}) {
  const radius = variant === 'darkUtility' ? '' : 'rounded-pill'
  const pad =
    size === 'lg'
      ? 'px-7 py-3.5 text-[18px] font-light'
      : variant === 'darkUtility'
        ? 'px-4 py-2 text-caption'
        : 'px-[22px] py-[11px] text-body-lg'
  const cls = `press inline-flex items-center justify-center gap-1.5 ${radius} ${pad} ${VARIANTS[variant]} font-text leading-none transition-colors duration-200 ${className}`

  const inner = (
    <>
      {children}
      {icon && <Icon name="arrow" size={17} className="-mr-0.5" />}
    </>
  )

  if (to) return <Link to={to} className={cls} onClick={onClick}>{inner}</Link>
  if (href) return <a href={href} className={cls} onClick={onClick}>{inner}</a>
  return (
    <button type={type || 'button'} onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

// ── Logo ───────────────────────────────────────────────────────────────
export function Logo({
  onDark = false,
  className = '',
}: {
  onDark?: boolean
  className?: string
}) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 max-sm:min-h-[44px] ${className}`}>
      <span className="grid h-7 w-7 place-items-center rounded-sm bg-primary text-white">
        <svg width="16" height="16" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M22 18h22v6.5H29.4v8.2h12.9v6.4H29.4V46H22V18Z" fill="currentColor" />
        </svg>
      </span>
      <span
        className={`font-display text-[17px] font-semibold uppercase tracking-[0.02em] ${
          onDark ? 'text-white' : 'text-ink'
        }`}
      >
        Finaccru<span className="text-primary"> Infotech</span>
      </span>
    </Link>
  )
}
