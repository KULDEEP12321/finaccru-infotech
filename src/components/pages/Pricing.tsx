import { useState } from 'react'
import { Section, Eyebrow, Button } from '@/components/ui/primitives'
import { PageHero, CTASection } from '@/components/ui/blocks'
import { Icon } from '@/components/ui/Icons'
import { siteContent, type PricingPlan, type Faq } from '@/lib/site-content'
const { pricing, faqs } = siteContent

function PriceCard({ plan }: { plan: PricingPlan }) {
  const featured = plan.featured
  return (
    <div
      className={`flex flex-col rounded-lg border p-7 ${
        featured ? 'border-primary bg-canvas shadow-product' : 'border-hairline bg-canvas'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="display-caps text-[20px] text-ink">{plan.name}</h3>
        {featured && (
          <span className="rounded-pill bg-primary/10 px-3 py-1 text-fine font-semibold text-primary">
            Most popular
          </span>
        )}
      </div>
      <p className="mt-3 text-caption text-ink-muted48">{plan.summary}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="display-caps text-[34px] text-ink">
          {plan.price}
        </span>
        <span className="text-caption text-ink-muted48">{plan.cadence}</span>
      </div>

      <Button to="/contact" variant={featured ? 'primary' : 'ghost'} className="mt-6 w-full">
        {plan.cta}
      </Button>

      <ul className="mt-7 space-y-3 border-t border-hairline pt-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-caption text-ink-muted80">
            <Icon name="check" size={16} className="mt-0.5 shrink-0 text-primary" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function FaqItem({ faq, open, onToggle }: { faq: Faq; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-hairline">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="display-caps text-[20px] text-ink">{faq.q}</span>
        <Icon name={open ? 'minus' : 'plus'} size={20} className="shrink-0 text-primary" />
      </button>
      {open && <p className="-mt-1 pb-5 pr-8 text-body-lg text-ink-muted80">{faq.a}</p>}
    </div>
  )
}

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Engagement models, not surprise invoices."
        lead="Three clear ways to work together. Pick the one that matches how much certainty you have — switch as the work evolves."
      />

      <Section surface="light">
        <div className="grid gap-6 lg:grid-cols-3">
          {pricing.map((plan) => (
            <PriceCard key={plan.id} plan={plan} />
          ))}
        </div>
        <p className="mt-8 text-center text-caption text-ink-muted48">
          All engagements include source-code ownership, weekly demos, and a named delivery lead.
        </p>
      </Section>

      {/* FAQ */}
      <Section surface="parchment" width="content">
        <div className="mb-8 text-center">
          <Eyebrow className="mb-3">Questions</Eyebrow>
          <h2 className="display-caps text-[40px] text-ink sm:text-[48px]">
            The things teams ask first.
          </h2>
        </div>
        <div>
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </Section>

      <CTASection
        title="Not sure which model fits?"
        lead="A 30-minute call is usually enough to point you at the right one. No pitch, no obligation."
      />
    </>
  )
}
