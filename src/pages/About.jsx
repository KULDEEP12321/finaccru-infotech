import { Container, Section, Eyebrow } from '../components/primitives.jsx'
import { CTASection, StatRow } from '../components/blocks.jsx'
import { values, stats, offices, company } from '../data/site.js'

export default function About() {
  return (
    <>
      {/* Editorial hero — the rare weight-300 reading */}
      <section className="bg-parchment">
        <Container width="content" className="py-20 text-center sm:py-28">
          <Eyebrow className="mb-5">About Finaccru Infotech</Eyebrow>
          <h1 className="display-caps text-[34px] text-ink sm:text-[44px]">
            We are engineers who care what the software actually does for the business behind it.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lead-airy text-ink-muted80">
            Since {company.founded}, we have helped founders, scale-ups, and enterprises turn
            ambitious ideas into systems that hold up under real load — and stay easy to change long
            after launch.
          </p>
        </Container>
      </section>

      {/* Story (dark) */}
      <section className="bg-tile1 text-white">
        <Container width="content" className="py-16 sm:py-section">
          <div className="grid gap-10 lg:grid-cols-[200px_1fr]">
            <Eyebrow onDark>Our story</Eyebrow>
            <div className="space-y-6 text-lead font-normal text-bodymuted">
              <p>
                Finaccru Infotech started as a small team frustrated by the gap between what
                businesses were promised and what software actually delivered. Too many projects
                ended in shelfware; too few left teams stronger than they started.
              </p>
              <p>
                So we built a different kind of firm — one measured by outcomes, not hours. Today we
                are a cross-functional group of product thinkers, designers, and engineers spread
                across three continents, shipping software for clients who expect it to just work.
              </p>
              <p className="text-white">
                The thread that has never changed: leave every team with a system they are proud to
                own.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values (light) */}
      <Section surface="light">
        <div className="mb-12 max-w-2xl">
          <Eyebrow className="mb-3">What we believe</Eyebrow>
          <h2 className="display-caps text-[40px] text-ink sm:text-[48px]">
            Three principles we will not trade away.
          </h2>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {values.map((v, i) => (
            <div key={v.title} className="border-t border-hairline pt-6">
              <span className="font-display text-tagline font-semibold text-primary">
                0{i + 1}
              </span>
              <h3 className="mt-3 display-caps text-[20px] text-ink">{v.title}</h3>
              <p className="mt-2 text-body-lg leading-relaxed text-ink-muted80">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats (parchment) */}
      <Section surface="parchment">
        <StatRow stats={stats} />
      </Section>

      {/* Offices (dark) */}
      <section className="bg-tile2 text-white">
        <Container className="py-16 sm:py-section">
          <div className="mb-12 max-w-2xl">
            <Eyebrow onDark className="mb-3">
              Where we are
            </Eyebrow>
            <h2 className="display-caps text-[40px] sm:text-[48px]">
              Three hubs, one team.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {offices.map((o) => (
              <div key={o.city} className="rounded-lg bg-white/[0.04] p-7 ring-1 ring-white/10">
                <p className="text-fine uppercase tracking-[0.08em] text-primary-ondark">{o.role}</p>
                <h3 className="mt-3 display-caps text-[28px]">
                  {o.city}
                </h3>
                <p className="mt-1 text-caption text-bodymuted">{o.country}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Want to build with us?"
        lead="We take on a small number of engagements at a time so each one gets the team it deserves."
      />
    </>
  )
}
