import { Container, Section, Eyebrow, Button } from '../components/primitives.jsx'
import { PageHero, CTASection } from '../components/blocks.jsx'
import { Icon } from '../components/Icons.jsx'
import { services, techStack } from '../data/site.js'

function ServiceDetail({ service, index }) {
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
