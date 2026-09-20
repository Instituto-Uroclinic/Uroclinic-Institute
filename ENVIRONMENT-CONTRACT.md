# Environment contract

Canonical production origin: `https://drjovaniurologo.org`.

| Variable | Class | Owner/storage | Required in production |
|---|---|---|---|
| GHL_PRIVATE_TOKEN | SECRET | Cloudflare runtime secret | yes |
| TURNSTILE_SECRET_KEY | SECRET | Cloudflare runtime secret | yes |
| ADMIN_API_KEY | SECRET | Cloudflare runtime secret | only if admin AI is enabled |
| GHL_LOCATION_ID | CONFIG | Worker variable | yes |
| TURNSTILE_SITE_KEY | PUBLIC_CONFIG | Worker variable | yes |
| PUBLIC_ORIGIN | CONFIG | Worker variable | yes |
| LEAD_SUBMISSIONS_ENABLED | CONFIG/kill switch | Worker variable | yes |
| IDEMPOTENCY_DB | D1 binding | Cloudflare binding | yes |

GitHub deployment credentials and runtime application secrets are separate. HighLevel and Turnstile secrets must not be copied into GitHub merely to deploy code.
