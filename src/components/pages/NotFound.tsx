import { Container, Button, Eyebrow } from '@/components/ui/primitives'

export default function NotFound() {
  return (
    <section className="bg-parchment">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <Eyebrow className="mb-4">404</Eyebrow>
        <h1 className="display-caps text-[40px] text-ink sm:text-[56px]">
          This page took a different path.
        </h1>
        <p className="mt-4 max-w-md text-lead font-normal text-ink-muted80">
          The link may be old or the page may have moved. Let’s get you back on track.
        </p>
        <div className="mt-8">
          <Button to="/">Back to home</Button>
        </div>
      </Container>
    </section>
  )
}
