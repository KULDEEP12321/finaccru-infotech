import { Container, Section, Eyebrow } from '@/components/ui/primitives'
import { CTASection, StatRow } from '@/components/ui/blocks'
import { Reveal } from '@/components/ui/Reveal'
import FHero from '@/components/layout/FHero'
import WorkGrid from '@/components/layout/WorkGrid'
import AutomationHero from '@/components/layout/AutomationHero'
import ServicesList from '@/components/layout/ServicesList'
import Marquee from '@/components/ui/Marquee'
import FreedomSection from '@/components/layout/FreedomSection'
import PrecisionSection from '@/components/layout/PrecisionSection'
import { Icon } from '@/components/ui/Icons'
import { stats } from '@/data/site'

export default function Home() {
  return (
    <>
      {/* ── Scroll-into-the-F aperture dive (the hero) ─────────── */}
      <FHero />

      {/* ── Selected work — staggered masonry grid + list view ──── */}
      <WorkGrid />

      {/* ── Statement (dark) — placed first so the dark dive hands off
             dark→dark with no seam ──────────────────────────────── */}
      <section className="bg-tile1 text-white">
        <Container className="py-24 text-center sm:py-32">
          <Reveal>
            <h2 className="display-caps mx-auto max-w-4xl text-[30px] sm:text-[46px]">
              One partner for the whole stack — strategy, design, engineering, and the team that
              keeps it running.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href="/services"
              className="mt-8 inline-flex items-center gap-1.5 text-body-lg text-primary-ondark max-sm:min-h-[44px] max-sm:py-2"
            >
              See how we work
              <Icon name="arrow" size={18} />
            </a>
          </Reveal>
        </Container>
      </section>

      {/* ── Trusted-by marquee ─────────────────────────────────── */}
      <section className="border-y border-black/[0.05] bg-canvas">
        <Container className="py-12">
          <p className="label-caps mb-7 text-center text-[12px] tracking-[0.16em] text-ink-muted48 sm:text-[11px]">
            Trusted by teams building on modern stacks
          </p>
          <Marquee />
        </Container>
      </section>

      {/* ── Full-viewport statement over a fixed background video ─── */}
      <AutomationHero />

      {/* ── Services grid (light) ─────────────────────────────────
          Inlined (not <Section>) so the container can exceed the site-wide 1440
          cap on big screens — the discipline rows fill large monitors instead of
          stranding them in the centre. Header + rows share the one wider wrapper,
          so they stay aligned with each other. At ≤1440 this is byte-identical to
          the standard Section/Container (max-w-wide, px-6 sm:px-10, py-20 sm:py-32). */}
      <section className="bg-canvas text-ink">
        <div className="mx-auto w-full max-w-wide px-6 py-20 sm:px-10 sm:py-32 min-[1440px]:max-w-[1760px]">
          <Reveal className="mb-12 max-w-2xl">
            <Eyebrow className="mb-4">What we do</Eyebrow>
            <h2 className="display-caps text-[40px] text-ink sm:text-[48px]">
              Six disciplines, one delivery team.
            </h2>
            <p className="mt-4 text-body-lg text-ink-muted80">
              Pick a single capability or hand us the whole problem — the same people see it through
              either way.
            </p>
          </Reveal>
          <ServicesList />
        </div>
      </section>

      {/* ── Stats (parchment) ─────────────────────────────────── */}
      <Section surface="parchment">
        <Reveal>
          <StatRow stats={stats} />
        </Reveal>
      </Section>

      {/* ── Problem/solution comparison (HLS video, new-look style) ── */}
      <FreedomSection />

      {/* ── Structured delivery staircase (blended new-look style) ── */}
      <PrecisionSection />

      {/* ── Closing CTA ───────────────────────────────────────── */}
      <CTASection />
    </>
  )
}
