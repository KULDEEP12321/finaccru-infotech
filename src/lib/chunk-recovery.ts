// Recover from "Failed to fetch dynamically imported module" navigation errors.
//
// TanStack Start auto-code-splits every route into a content-hashed chunk (e.g.
// /assets/contact-DY89-rKF.js) that the router loads via dynamic import() on
// navigation. When a new build ships, the hashes change. A tab that was opened
// against the OLD build still asks for OLD chunk URLs — after the deploy those
// files no longer exist on the server, so the import 404s and the navigation
// throws "Failed to fetch dynamically imported module". The same happens after a
// local rebuild while an old tab is still open.
//
// The fix is to force a single full reload, which re-fetches the current
// index.html and its up-to-date chunk URLs, then the navigation succeeds. A
// short time-based guard stops a genuinely-unreachable chunk (offline, a server
// that isn't serving /assets at all) from reload-looping forever.

const RELOAD_GUARD_KEY = 'chunk-recovery:last-reload'
const RELOAD_GUARD_MS = 10_000

// Browser-specific phrasings for "the chunk for this dynamic import could not be
// fetched" (Chrome / Firefox / Safari respectively).
const CHUNK_ERROR_RE =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i

function reloadOnce(message: string): boolean {
  // hls.js is a non-critical, lazily-loaded background-video chunk with its own
  // catch (FreedomSection). A failure there must never trigger a surprise reload
  // of the whole page.
  if (/hls/i.test(message)) return false

  let last = 0
  try {
    last = Number(sessionStorage.getItem(RELOAD_GUARD_KEY) || '0')
  } catch {
    // sessionStorage can throw in private mode / sandboxed iframes — ignore and
    // fall through to a (single) reload attempt.
  }

  // Already reloaded for a stale chunk in the last few seconds: the chunk is
  // genuinely unreachable, not just stale. Stop here so the real error surfaces
  // instead of an infinite reload loop.
  if (Date.now() - last < RELOAD_GUARD_MS) return false

  try {
    sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()))
  } catch {
    // ignore storage failures; the worst case is one extra reload.
  }
  window.location.reload()
  return true
}

let installed = false

export function installChunkRecovery() {
  if (typeof window === 'undefined' || installed) return
  installed = true

  // Primary path: Vite raises this cancelable event when its preload helper
  // fails to fetch a dynamically-imported chunk. Preventing the default stops
  // the error from being re-thrown once we've decided to recover.
  window.addEventListener('vite:preloadError', (event) => {
    const message = String(
      (event as Event & { payload?: { message?: string } }).payload?.message ?? '',
    )
    if (reloadOnce(message)) event.preventDefault()
  })

  // Fallback path: some failures surface only as the import() promise rejecting
  // (no preloadError), e.g. a hand-written dynamic import. Match the
  // browser-specific messages so we don't reload on unrelated rejections.
  window.addEventListener('unhandledrejection', (event) => {
    const message = String(
      (event.reason as { message?: string } | undefined)?.message ?? event.reason ?? '',
    )
    if (CHUNK_ERROR_RE.test(message)) reloadOnce(message)
  })
}
