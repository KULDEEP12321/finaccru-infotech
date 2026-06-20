// Shared formatting helpers for the blog UI.

/** "12 June 2026" — locale-stable long date for cards and article meta. */
export function formatDate(value?: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** "5 min read" from a precomputed reading-time estimate (rounded, min 1). */
export function readingLabel(minutes?: number): string {
  const m = Math.max(1, Math.round(minutes ?? 1))
  return `${m} min read`
}
