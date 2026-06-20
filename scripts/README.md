# Automated blog posts

`generate-post.mjs` writes and publishes a blog post end-to-end, with no human
in the loop:

1. reads existing article titles from Sanity (so it never repeats a topic),
2. asks **Claude** (`claude-opus-4-8`) to invent an on-brand topic + write the
   full article (title, description, category, tags, Markdown body, image briefs),
3. converts the Markdown body to Sanity **Portable Text**,
4. pulls a **cover image + 2–3 inline images** from **Unsplash** and uploads them
   to Sanity,
5. creates the `article` document with `publishedAt = now` → **live immediately**.

It runs on a schedule via [`.github/workflows/blog-autopost.yml`](../.github/workflows/blog-autopost.yml)
(default: **Mondays 09:00 UTC**). The live site reads Sanity with a token-less
client — this script is the **only** place a write token is used, and it never
runs inside the deployed app.

## Required secrets

Add these in **GitHub → repo Settings → Secrets and variables → Actions**:

| Secret | Where to get it | Required |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | <https://console.anthropic.com> → API Keys | ✅ |
| `SANITY_WRITE_TOKEN` | <https://manage.sanity.io> → project `2jhreob8` → API → Tokens → **Editor** | ✅ |
| `UNSPLASH_ACCESS_KEY` | <https://unsplash.com/developers> → New Application → *Access Key* | optional — without it, posts publish text-only |

## Run / cadence

- **Change the schedule:** edit the `cron` in the workflow ([crontab.guru](https://crontab.guru)).
- **Trigger now:** Actions tab → *Auto-publish blog post* → *Run workflow*
  (tick "dry run" to generate without publishing).

## Test locally

```bash
# dry run — generates a real article + image briefs, prints the doc, publishes nothing
ANTHROPIC_API_KEY=sk-ant-... \
UNSPLASH_ACCESS_KEY=... \
npm run blog:generate -- --dry-run

# real publish (needs the write token)
ANTHROPIC_API_KEY=sk-ant-... \
SANITY_WRITE_TOKEN=sk... \
UNSPLASH_ACCESS_KEY=... \
npm run blog:generate
```

## Tuning

- **Editorial direction:** edit `SERVICE_AREAS` / `SYSTEM_PROMPT` in `generate-post.mjs`.
- **Model:** set `BLOG_MODEL` (e.g. `claude-sonnet-4-6` for a cheaper run).
- **Image source:** currently Unsplash; `fetchUnsplash()` is isolated so Pexels /
  Pixabay can be added as fallbacks.
