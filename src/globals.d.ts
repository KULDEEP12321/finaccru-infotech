// Ambient augmentations for browser globals this app touches directly.
// Note: `Window.lenis` is already declared by the `lenis` package itself,
// so we don't redeclare it here (App casts when assigning the instance).
declare global {
  interface Navigator {
    // Non-standard but widely shipped; used for low-end device heuristics.
    deviceMemory?: number
  }
}

export {}
