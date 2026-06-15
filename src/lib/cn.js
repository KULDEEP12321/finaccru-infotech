import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Conditional class names with Tailwind conflict resolution.
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
