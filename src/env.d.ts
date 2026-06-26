// Secret Cloudflare Worker bindings that are NOT in wrangler.jsonc `vars`, so
// `wrangler types` can't see them (it only knows public vars + bindings). These
// are set in production with `wrangler secret put <NAME>` and locally via a
// `.dev.vars` file. Declaration-merged into the generated `Cloudflare.Env` type
// (worker-configuration.d.ts) so `env.SMTP_PASSWORD` stays typed everywhere,
// including on fresh checkouts before the generated types exist.
//
// This file is intentionally a global script (no import/export) so the
// namespace augmentation applies ambiently.
declare namespace Cloudflare {
  interface Env {
    /** SMTP auth password — secret. `wrangler secret put SMTP_PASSWORD`. */
    SMTP_PASSWORD: string
  }
}
