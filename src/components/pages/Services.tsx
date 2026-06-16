import { Link } from '@tanstack/react-router'
import { Container, Section, Eyebrow, Button } from '@/components/ui/primitives'
import { PageHero, CTASection } from '@/components/ui/blocks'
import { Icon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import { services, serviceCategories, techStack, type Service } from '@/data/site'

function ServiceDetail({ service, index }: { service: Service; index: number }) {
  const onDark = index % 2 === 1
  const surface = onDark ? 'bg-tile1 text-white' : 'bg-canvas text-ink'
  const cardBg = onDark ? 'bg-white/[0.04] ring-white/10' : 'bg-parchment ring-black/[0.04]'
  return (
    <section className={surface}>
      <Container className="grid items-center gap-10 py-16 sm:py-section lg:grid-cols-2">
        {/* Visual side — alternates left/right */}
        <div className={`${onDark ? 'lg:order-2' : ''}`}>
          <div className={`rounded-lg p-10 ring-1 ${cardBg}`}>
            <span
              className={`grid h-14 w-14 place-items-center rounded-md ${
                onDark ? 'bg-primary/15 text-primary-ondark' : 'bg-white text-primary'
              }`}
            >
              <Icon name={service.icon} size={28} />
            </span>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {service.capabilities.map((c) => (
                <div
                  key={c}
                  className={`rounded-md px-3 py-2.5 text-caption ${
                    onDark ? 'bg-white/5 text-bodymuted' : 'bg-white text-ink-muted80'
                  }`}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copy side */}
        <div className={`${onDark ? 'lg:order-1' : ''}`}>
          <Eyebrow onDark={onDark} className="mb-3">
            {service.tagline}
          </Eyebrow>
          <h2 className="display-caps text-[34px] sm:text-[40px]">
            {service.name}
          </h2>
          <p
            className={`mt-4 text-lead font-normal ${onDark ? 'text-bodymuted' : 'text-ink-muted80'}`}
          >
            {service.long}
          </p>
          <div className="mt-7">
            <Button to="/contact" variant={onDark ? 'ghostDark' : 'ghost'}>
              Discuss your project
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything it takes to ship and run great software."
        lead="Six core disciplines, delivered by one accountable team — so the strategy, the build, and the operations never fall out of sync."
      >
        <Button to="/contact">Start a project</Button>
        <Button to="/pricing" variant="ghost">
          See pricing
        </Button>
      </PageHero>

      {services.map((service, i) => (
        <ServiceDetail key={service.id} service={service} index={i} />
      ))}

      {/* Specialized practices — deeper offerings, each its own detail page */}
      <Section surface="light">
        <Reveal className="mb-10 max-w-2xl">
          <Eyebrow className="mb-3">Specialized practices</Eyebrow>
          <h2 className="display-caps text-[40px] text-ink sm:text-[48px]">
            Go deeper with a dedicated practice.
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted80">
            Four focused teams, each with its own catalogue of services — pick the one that maps to
            the problem in front of you.
          </p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {serviceCategories.map((cat, i) => (
            <Reveal key={cat.slug} delay={(i % 2) * 0.06} y={18}>
              <Link
                to="/services/$slug"
                params={{ slug: cat.slug }}
                className="press group flex h-full flex-col rounded-lg border border-hairline bg-canvas p-8 transition-colors hover:border-primary/40"
              >
                <span className="grid h-12 w-12 place-items-center rounded-md bg-parchment text-primary">
                  <Icon name={cat.icon} size={24} />
                </span>
                <h3 className="display-caps mt-6 text-[22px] text-ink">{cat.name}</h3>
                <p className="mt-3 flex-1 text-caption leading-relaxed text-ink-muted80">
                  {cat.summary}
                </p>
                <span className="label-caps mt-6 inline-flex items-center gap-1.5 text-[12px] tracking-[0.1em] text-primary">
                  Explore practice
                  <Icon
                    name="arrow"
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Tech stack */}
      <Section surface="parchment">
        <div className="mb-10 max-w-2xl">
          <Eyebrow className="mb-3">Our toolkit</Eyebrow>
          <h2 className="display-caps text-[40px] text-ink sm:text-[48px]">
            Proven tools, chosen for fit — not fashion.
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted80">
            We are deliberately boring about the foundations so we can be ambitious about the
            outcomes.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {techStack.map((t) => (
            <span
              key={t}
              className="rounded-pill border border-hairline bg-canvas px-4 py-2 text-caption text-ink-muted80"
            >
              {t}
            </span>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  )
}
