# 111X baseline

- SOURCE: uploaded ZIP `Uroclinic-Institute-main.zip`; `.git` metadata absent, therefore original Git SHA/branch/status are **BLOCKED**, not inferred.
- DEPLOYMENT_TARGET: Cloudflare Workers + Static Assets.
- ASTRO_OUTPUT: NOT_APPLICABLE; this repository is not Astro and has no Astro dependency/config.
- CLOUDFLARE_ADAPTER: NOT_APPLICABLE.
- CLOUDFLARE_MODE: Worker script (`worker/index.js`) with `[assets] directory=./dist`.
- PRODUCTION_BRANCH: repository workflows target `main`; actual Cloudflare production branch cannot be proven from ZIP alone.
- BUILD_COMMAND: `npm run build`.
- OUTPUT_DIRECTORY: `dist`.
- RUNTIME_BINDINGS: `ASSETS`, `LEAD_RATE_LIMITER`; 111X additionally requires D1 `IDEMPOTENCY_DB` before lead writes can be enabled.
- API routes: `/api/public-config`, `/api/health`, `/api/lead`, `/api/admin/ai`.
- Baseline critical defects found: `wrangler.toml` pointed to missing `worker/index.js`; no build script/lockfile; Turnstile failed open when secret absent; Contacts Upsert used old global version and included `tags`; success could be returned when CRM failed but a secondary succeeded; no persistent idempotency; health exposed CRM configuration state.

The user's provisional hypothesis “Astro SSR + @astrojs/cloudflare + Pages Advanced Worker” is disproven by the uploaded files. Security hardening is therefore implemented in the Worker response path plus `_headers` for static assets, not Astro middleware.
