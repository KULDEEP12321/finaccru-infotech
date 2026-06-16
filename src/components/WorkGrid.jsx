import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { cn } from '../lib/cn.js'

// WorkGrid — a Podium-style selected-work showcase: a black, staggered masonry
// grid of projects (title + year + client, upcoming ones greyed out) with a
// floating GRID / LIST toggle. List view mirrors the premium portfolio pattern:
// rows of title/year/sector with a thumbnail preview that tracks the cursor.
//
// Everything here is Finaccru's own — illustrative project names, sectors, and
// CSS-rendered thumbnails (gradient + tech motif + grain). No external media.

// ── Projects (illustrative case studies for a software & IT studio) ───────────
const projects = [
  { id: 'ledgerline', name: 'Ledgerline', year: '2025', sector: 'Fintech Platform', theme: 'blue', motif: 'rings', ar: 'aspect-[4/5]' },
  { id: 'fleetpulse', name: 'Fleetpulse', year: '2025', sector: 'Logistics', theme: 'steel', motif: 'topo', ar: 'aspect-[16/11]' },
  { id: 'clinic-os', name: 'Clinic OS', year: '2024', sector: 'Healthcare', theme: 'cyan', motif: 'wave', ar: 'aspect-square' },
  { id: 'meridian', name: 'Meridian', year: '2025', sector: 'Retail & Commerce', theme: 'amber', motif: 'scan', ar: 'aspect-[4/5]' },
  { id: 'nimbus', name: 'Nimbus', year: '2024', sector: 'Cloud Infra', theme: 'sky', motif: 'grid', ar: 'aspect-[16/12]' },
  { id: 'harbor', name: 'Harbor', year: '2025', sector: 'Supply Chain', theme: 'deep', motif: 'wave', ar: 'aspect-[16/11]' },
  { id: 'atlas', name: 'Atlas', year: '2026', sector: 'Data & AI', theme: 'mono', motif: 'topo', ar: 'aspect-[4/5]', upcoming: true },
  { id: 'sentinel', name: 'Sentinel', year: '2026', sector: 'Cybersecurity', theme: 'mono', motif: 'rings', ar: 'aspect-square', upcoming: true },
]

const THEMES = {
  blue: 'linear-gradient(150deg,#0a2a4d 0%,#0066cc 62%,#2997ff 100%)',
  steel: 'linear-gradient(160deg,#0b1220 0%,#1c2c3e 70%,#2e4760 100%)',
  cyan: 'linear-gradient(145deg,#04222b 0%,#0a5566 60%,#1aa0b8 100%)',
  amber: 'linear-gradient(150deg,#2a1604 0%,#9c5410 55%,#e0902a 100%)',
  sky: 'linear-gradient(135deg,#0a3a66 0%,#0a7bd0 60%,#5cb6ff 100%)',
  deep: 'linear-gradient(155deg,#04161f 0%,#0a3550 65%,#0e6aa0 100%)',
  mono: 'linear-gradient(150deg,#0d0d0f 0%,#1c1c20 70%,#2c2c32 100%)',
}

// subtle film grain (echoes Podium's grainy footage), drawn once as a data-URI
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

function Motif({ kind }) {
  const stroke = 'rgba(255,255,255,0.16)'
  if (kind === 'rings')
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {[14, 26, 38, 50, 62].map((r) => (
          <circle key={r} cx="72" cy="34" r={r} fill="none" stroke={stroke} strokeWidth="0.5" />
        ))}
      </svg>
    )
  if (kind === 'grid')
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 12.5} y1="0" x2={i * 12.5} y2="100" stroke={stroke} strokeWidth="0.4" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 16.6} x2="100" y2={i * 16.6} stroke={stroke} strokeWidth="0.4" />
        ))}
      </svg>
    )
  if (kind === 'wave')
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 46 L10 40 L20 44 L30 30 L40 36 L50 20 L60 28 L70 14 L80 22 L90 8 L100 16" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />
        <path d="M0 46 L10 40 L20 44 L30 30 L40 36 L50 20 L60 28 L70 14 L80 22 L90 8 L100 16 L100 60 L0 60 Z" fill="rgba(255,255,255,0.05)" />
      </svg>
    )
  if (kind === 'topo')
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M-5 ${30 + i * 12} C 20 ${18 + i * 12}, 45 ${42 + i * 12}, 70 ${26 + i * 12} S 110 ${34 + i * 12}, 110 ${34 + i * 12}`}
            fill="none"
            stroke={stroke}
            strokeWidth="0.5"
          />
        ))}
      </svg>
    )
  // scan
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1={-20 + i * 12} y1="0" x2={10 + i * 12} y2="100" stroke={stroke} strokeWidth="0.5" />
      ))}
    </svg>
  )
}

// The thumbnail visual (gradient + motif + grain + hover sheen).
function Thumb({ project, className = '', label = true }) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={{ background: THEMES[project.theme] }}>
      <Motif kind={project.motif} />
      {/* depth + vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 120% at 70% 20%, rgba(255,255,255,0.10), transparent 55%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)' }} />
      {/* grain */}
      <div className="absolute inset-0 opacity-[0.18] mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: '120px 120px' }} />
      {/* tiny corner index/label, like a film slate (omitted in the thin list reveal) */}
      {label && (
        <span className="absolute left-3 top-3 font-display text-[11px] font-medium uppercase tracking-[0.18em] text-white/60 sm:text-[10px]">
          {project.upcoming ? 'In production' : 'Case study'}
        </span>
      )}
    </div>
  )
}

// ── Grid-view card ────────────────────────────────────────────────────────────
function Card({ project, reduce }) {
  return (
    <Link
      to="/contact"
      className={`group block ${project.upcoming ? 'pointer-events-none' : ''}`}
      aria-label={`${project.name} — ${project.sector}`}
    >
      {/* Entrance: the thumbnail wipes + rises in as it scrolls into view (once),
          echoing how Podium reveals its footage tiles. */}
      <motion.div
        className={`${project.ar} overflow-hidden`}
        initial={reduce ? false : { opacity: 0, y: 38, clipPath: 'inset(14% 0% 0% 0%)' }}
        whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-full w-full transition-transform duration-[600ms] ease-apple group-hover:scale-[1.04]">
          <Thumb project={project} />
        </div>
      </motion.div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3
          className={`display-caps text-[clamp(20px,2vw,30px)] transition-colors duration-300 ${
            project.upcoming ? 'text-white/30' : 'text-white group-hover:text-primary-ondark'
          }`}
        >
          {project.name}
        </h3>
        <div className={`shrink-0 pt-1 text-right text-[12px] leading-[1.5] tracking-wide sm:text-[11px] ${project.upcoming ? 'text-white/25' : 'text-white/55'}`}>
          <div>{project.year}</div>
          <div className="uppercase">{project.sector}</div>
        </div>
      </div>
    </Link>
  )
}

export default function WorkGrid() {
  const [view, setView] = useState('grid') // 'grid' | 'list'
  const [hovered, setHovered] = useState(null) // project for the list-view cursor preview
  const [activeIndex, setActiveIndex] = useState(-1) // list-view scroll-active row (mobile)
  const previewRef = useRef(null)
  const sectionRef = useRef(null)
  const listRowsRef = useRef([])
  const reduce = useReducedMotion()

  // List view has no cursor on touch, so below `lg` the preview is driven by SCROLL:
  // the row crossing the viewport centre becomes active and reveals its thumbnail
  // inline. Desktop keeps the cursor-tracked preview (observer never runs there).
  useEffect(() => {
    if (view !== 'list' || typeof IntersectionObserver === 'undefined' || !window.matchMedia) {
      setActiveIndex(-1)
      return
    }
    const mq = window.matchMedia('(max-width: 1023px)')
    let io
    const setup = () => {
      io?.disconnect()
      io = null
      setActiveIndex(-1)
      if (!mq.matches) return // desktop → cursor preview handles it
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) setActiveIndex(Number(e.target.dataset.index))
          }
        },
        { rootMargin: '-46% 0px -46% 0px', threshold: 0 }
      )
      listRowsRef.current.forEach((el) => el && io.observe(el))
    }
    setup()
    mq.addEventListener?.('change', setup)
    return () => {
      io?.disconnect()
      mq.removeEventListener?.('change', setup)
    }
  }, [view])

  // Desktop staggered columns (4), distributed round-robin with per-column offsets.
  const COLS = 4
  const columns = Array.from({ length: COLS }, (_, c) => projects.filter((_, i) => i % COLS === c))
  const colOffset = ['lg:mt-0', 'lg:mt-[15vh]', 'lg:mt-[6vh]', 'lg:mt-[24vh]']

  // ── Podium-style per-column parallax ────────────────────────────────────────
  // As the section travels through the viewport (progress 0→1) the columns drift
  // vertically. Odd columns (1 & 3) rush UP fast and dissolve into the top veil;
  // even columns (2 & 4) drift gently DOWN and linger — so 1 & 3 read as the fast
  // pair that "reaches the top and fades away" (podium.global's signature, pushed
  // a touch harder than podium's own ~[-0.105, +0.084, -0.063, +0.055] px/px).
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const PARALLAX = 200 // px of half-travel for the fastest column
  const colFactor = [-1, 0.5, -0.85, 0.45] // cols 1 & 3 fast-up; cols 2 & 4 gentle-down
  // Hooks must be unconditional and fixed in count → one transform per column.
  const yA = useTransform(scrollYProgress, [0, 1], [-colFactor[0] * PARALLAX, colFactor[0] * PARALLAX])
  const yB = useTransform(scrollYProgress, [0, 1], [-colFactor[1] * PARALLAX, colFactor[1] * PARALLAX])
  const yC = useTransform(scrollYProgress, [0, 1], [-colFactor[2] * PARALLAX, colFactor[2] * PARALLAX])
  const yD = useTransform(scrollYProgress, [0, 1], [-colFactor[3] * PARALLAX, colFactor[3] * PARALLAX])
  const colY = [yA, yB, yC, yD]

  // List view: move the floating preview with the cursor (no re-render per move).
  const onListMove = (e) => {
    const el = previewRef.current
    if (!el) return
    el.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 130}px)`
  }

  return (
    <section ref={sectionRef} className="relative bg-black text-white">
      {/* ── Black veil, pinned to the viewport while the grid is in view ─────────
          The section sits on black, so cards emerge from black at the bottom and
          dissolve into black at the top — keeping the lit centre as the focus as
          you scroll (Podium's signature). The sticky element + (-100vh margin)
          pins it to the viewport without consuming layout space, and releases on
          its own when the section scrolls away. Desktop only; z-20 sits over the
          cards (z-10) but under the floating toggle (z-30). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <div className="sticky top-0 h-screen w-full">
          <div
            className="absolute inset-x-0 top-0 h-[38vh]"
            style={{
              background:
                'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.7) 32%, rgba(0,0,0,0.22) 72%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[40vh]"
            style={{
              background:
                'linear-gradient(to top, #000 0%, rgba(0,0,0,0.7) 32%, rgba(0,0,0,0.22) 72%, transparent 100%)',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-wide px-6 py-20 sm:px-10 sm:py-28">
        {/* header */}
        <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-6 sm:mb-16">
          <div>
            <p className="label-caps text-[12px] tracking-[0.18em] text-primary-ondark">Selected work</p>
            <h2 className="display-caps mt-3 text-[34px] text-white sm:text-[52px]">Platforms we&rsquo;ve shipped</h2>
          </div>
          <span className="hidden font-display text-[13px] uppercase tracking-[0.16em] text-white/40 sm:block">
            ({String(projects.length).padStart(2, '0')}) — 2024&ndash;2026
          </span>
        </div>

        {/* ── GRID VIEW ─────────────────────────────────────────────── */}
        {view === 'grid' && (
          <>
            {/* desktop: staggered 4-col masonry */}
            <div className="hidden items-start gap-6 lg:flex">
              {columns.map((col, ci) => (
                <motion.div
                  key={ci}
                  style={reduce ? undefined : { y: colY[ci] }}
                  className={`flex flex-1 flex-col gap-16 ${colOffset[ci]}`}
                >
                  {col.map((p) => (
                    <Card key={p.id} project={p} reduce={reduce} />
                  ))}
                </motion.div>
              ))}
            </div>
            {/* below lg: simple masonry flow */}
            <div className="columns-1 gap-6 [column-fill:balance] sm:columns-2 lg:hidden">
              {projects.map((p) => (
                <div key={p.id} className="mb-12 break-inside-avoid">
                  <Card project={p} reduce={reduce} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── LIST VIEW ─────────────────────────────────────────────── */}
        {view === 'list' && (
          <div onMouseMove={onListMove} onMouseLeave={() => setHovered(null)}>
            {projects.map((p, idx) => {
              const live = activeIndex === idx && !p.upcoming // mobile scroll-active
              return (
                <Link
                  key={p.id}
                  ref={(el) => (listRowsRef.current[idx] = el)}
                  data-index={idx}
                  to="/contact"
                  onMouseEnter={() => setHovered(p)}
                  className={cn(
                    'group relative grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-white/10 py-6 transition-colors duration-300 max-lg:overflow-hidden sm:grid-cols-[5rem_1fr_12rem] sm:py-7',
                    p.upcoming ? 'pointer-events-none' : 'hover:border-white/40',
                    live && 'border-white/40'
                  )}
                >
                  {/* mobile: scroll-active thumbnail reveals as the row backdrop, with a
                      left-heavy scrim so the title/meta stay legible (desktop uses the
                      cursor-tracked preview instead, so this is hidden ≥lg). */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute inset-0 origin-center transition-[opacity,transform] duration-[600ms] ease-out lg:hidden',
                      live ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'
                    )}
                  >
                    <Thumb project={p} label={false} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.46) 50%, rgba(0,0,0,0.2) 100%)' }} />
                  </div>
                  <span className={cn('relative hidden font-display text-[13px] tracking-[0.16em] sm:block', p.upcoming ? 'text-white/20' : 'text-white/35')}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className={cn(
                      'relative display-caps text-[clamp(26px,4vw,52px)] transition-all duration-300',
                      p.upcoming ? 'text-white/25' : 'text-white/80 group-hover:translate-x-2 group-hover:text-white',
                      live && 'translate-x-2 text-white'
                    )}
                  >
                    {p.name}
                  </h3>
                  <div className={cn('relative text-right text-[12px] leading-[1.6] tracking-wide', p.upcoming ? 'text-white/20' : 'text-white/55', live && 'text-white/80')}>
                    <span className="sm:hidden">{p.year} · </span>
                    <span className="uppercase">{p.sector}</span>
                    <div className="hidden sm:block">{p.year}</div>
                  </div>
                </Link>
              )
            })}

            {/* cursor-tracking preview (desktop pointers only) */}
            <div
              ref={previewRef}
              aria-hidden="true"
              className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[260px] w-[200px] overflow-hidden rounded-lg shadow-2xl lg:block"
              style={{ opacity: hovered && !hovered.upcoming ? 1 : 0, transition: 'opacity 220ms ease', willChange: 'transform' }}
            >
              {hovered && <Thumb project={hovered} />}
            </div>
          </div>
        )}

        {/* ── floating GRID / LIST toggle ───────────────────────────── */}
        <div className="pointer-events-none sticky bottom-6 z-30 mt-16 flex justify-center">
          <div className="pointer-events-auto inline-flex items-center gap-1 rounded-pill border border-white/15 bg-black/70 p-1 backdrop-blur-md">
            {[
              { key: 'grid', label: 'Grid', icon: GridIcon },
              { key: 'list', label: 'List', icon: ListIcon },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                aria-pressed={view === key}
                className={`inline-flex items-center gap-2 rounded-pill px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 max-sm:min-h-[44px] max-sm:py-3 ${
                  view === key ? 'bg-white text-black' : 'text-white/65 hover:text-white'
                }`}
              >
                <Icon />
                {label} view
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      {[0, 7].map((x) => [0, 7].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" rx="1" fill="currentColor" />))}
    </svg>
  )
}
function ListIcon() {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" aria-hidden="true">
      {[1, 6, 11].map((y) => (
        <rect key={y} x="0" y={y} width="14" height="2" rx="1" fill="currentColor" />
      ))}
    </svg>
  )
}
