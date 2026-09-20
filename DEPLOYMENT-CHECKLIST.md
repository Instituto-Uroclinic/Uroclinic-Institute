# Deployment checklist

## AUTOMATED
`npm ci` → `npm run verify` → build → tests → source/build secret scan → Action SHA gate.

## MANUAL / CLOUDFLARE
Create separate preview and production D1 databases; apply `migrations/0001_lead_submissions.sql`; bind each as `IDEMPOTENCY_DB`; configure environment variables; add runtime secrets; keep `LEAD_SUBMISSIONS_ENABLED=false` until preflight passes.

## MANUAL / HIGHLEVEL
Confirm Location duplicate policy and matching priority; confirm `contacts.write`; controlled synthetic upsert/tag test.

## MANUAL / GITHUB
Protect production environment/branch as plan permits; ensure untrusted PRs cannot access production deployment credentials.

## GO-LIVE GATE
Only after preview verification, set the production kill switch to true and run post-deploy rejection tests plus an explicitly authorized synthetic lead.
