# Headers matrix
| Surface | Mechanism | Status |
|---|---|---|
| Worker API `/api/*` | `withSecurity()` + `safeJson()` | TESTED unit-level: no-store + nosniff PASS |
| Static assets | `_headers` | IMPLEMENTED; live verification BLOCKED until preview deploy |
| Worker-served static response | `withSecurity()` wraps `ASSETS.fetch()` | IMPLEMENTED; live verification BLOCKED |
| Canonical redirect | Worker 308 + security wrapper | IMPLEMENTED; live verification BLOCKED |
| 404 static fallback | Worker security wrapper | IMPLEMENTED; live verification BLOCKED |
