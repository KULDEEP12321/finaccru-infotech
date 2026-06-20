import { Container, Section, Eyebrow, Button } from '@/components/ui/primitives'
import { PageHero, CTASection } from '@/components/ui/blocks'
import { Icon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import SubserviceList from '@/components/layout/SubserviceList'
import { siteContent } from '@/lib/site-content'
const { serviceCategories } = siteContent
import NotFound from '@/components/pages/NotFound'

export default function ServiceCategory({ slug }: { slug: string }) {
  const cat = serviceCategories.find((c) => c.slug === slug)
  if (!cat) return <NotFound />

  return (
    <>
      <PageHero eyebrow={cat.label} title={cat.heroTitle} lead={cat.heroLead}>
        <Button to="/contact">Start a project</Button>
        <Button to="/pricing" variant="ghost">
          See pricing
        </Button>
      </PageHero>

      {/* ── Sub-services showcase (light) — alternating image+copy rows ─── */}
      <Section surface="light">
        <Reveal className="mb-14 max-w-2xl sm:mb-20">
          <Eyebrow className="mb-3">{cat.subhead}</Eyebrow>
          <h2 className="display-caps text-[34px] text-ink sm:text-[40px]">
            {cat.name}
          </h2>
          {cat.subLead && (
            <p className="mt-4 text-body-lg text-ink-muted80">{cat.subLead}</p>
          )}
        </Reveal>
        <SubserviceList items={cat.subservices} />
      </Section>

      {/* ── Why choose us (dark) ──────────────────────────────────────── */}
      <section className="bg-tile1 text-white">
        <Container className="py-20 sm:py-section">
          <Reveal className="mb-10 max-w-2xl">
            <Eyebrow onDark className="mb-3">
              Why Finaccru
            </Eyebrow>
            <h2 className="display-caps text-[34px] sm:text-[40px]">{cat.benefitsTitle}</h2>
          </Reveal>
          <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {cat.benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 border-t border-white/10 pt-5">
                <span className="mt-0.5 shrink-0 text-primary-ondark">
                  <Icon name="check" size={20} />
                </span>
                <p className="text-body-lg text-bodymuted">{b}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Process staircase (parchment) — present only where defined ─── */}
      {cat.process && (
        <Section surface="parchment">
          <Reveal className="mb-12 max-w-2xl">
            <Eyebrow className="mb-3">How we work</Eyebrow>
            <h2 className="display-caps text-[34px] text-ink sm:text-[40px]">
              A disciplined, repeatable engagement.
            </h2>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {cat.process.map((p) => (
              <div key={p.step} className="border-t border-hairline pt-6">
                <span className="font-display text-tagline font-semibold text-primary">
                  {p.step}
                </span>
                <h3 className="mt-3 display-caps text-[20px] text-ink">{p.title}</h3>
                <p className="mt-2 text-caption leading-relaxed text-ink-muted80">{p.body}</p>
              </div>
            ))}
          </div>

          {/* metrics row — present only where defined */}
          {cat.metrics && (
            <div className="mt-14 grid grid-cols-3 gap-8 border-t border-hairline pt-10">
              {cat.metrics.map((m) => (
                <div key={m.label}>
                  <div className="font-display text-[40px] font-semibold leading-none tracking-[-0.02em] text-ink sm:text-[44px]">
                    {m.value}
                  </div>
                  <div className="label-caps mt-3 text-[11px] tracking-[0.14em] text-ink-muted48">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      <CTASection />
    </>
  )
}
