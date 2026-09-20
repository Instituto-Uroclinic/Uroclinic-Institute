# 111X changes
- Corrected runtime fingerprint to Workers + Static Assets (not Astro SSR).
- Added fail-closed Turnstile, v3 HighLevel contact upsert, separate v3 tag operation, CRM-authoritative success semantics.
- Added D1 idempotency schema/ledger contract, submission IDs, payload conflict detection, API no-store/security headers, canonical redirect, passive health, kill switch and structured redacted logging.
- Added reproducible build/tests/scans, full-SHA Action gate, environment contract and deployment/rollback/reconciliation runbooks.
- Known blocker: automatic partial-saga resume and opportunity creation are not implemented; D1 and real runtime secrets are not provisioned from this secret-free ZIP.
