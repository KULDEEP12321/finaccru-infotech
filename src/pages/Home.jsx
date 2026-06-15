import { Container, Section, Eyebrow } from '../components/primitives.jsx'
import { CTASection, StatRow } from '../components/blocks.jsx'
import { Reveal } from '../components/Reveal.jsx'
import FHero from '../components/FHero.jsx'
import WorkGrid from '../components/WorkGrid.jsx'
import ServicesList from '../components/ServicesList.jsx'
import Marquee from '../components/Marquee.jsx'
import FreedomSection from '../components/FreedomSection.jsx'
import PrecisionSection from '../components/PrecisionSection.jsx'
import { Icon } from '../components/Icons.jsx'
import { stats } from '../data/site.js'

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
              className="mt-8 inline-flex items-center gap-1.5 text-body-lg text-primary-ondark"
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
          <p className="label-caps mb-7 text-center text-[11px] tracking-[0.16em] text-ink-muted48">
            Trusted by teams building on modern stacks
          </p>
          <Marquee />
        </Container>
      </section>

      {/* ── Services grid (light) ─────────────────────────────── */}
      <Section surface="light">
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
      </Section>

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
