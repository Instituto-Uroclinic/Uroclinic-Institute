# UROCLINIC 111X FORTALEZA — evidence

| CONTROL | CLAIMED | IMPLEMENTED | TESTED | RESULT | EVIDENCE | REMAINING RISK |
|---|---:|---:|---:|---|---|---|
| Runtime fingerprint | yes | yes | static inspection | PASS | `audit/BASELINE.md`, `wrangler.toml` | Cloud dashboard not inspected |
| HighLevel Upsert v3 | yes | yes | unit | PASS | `worker/lib/highlevel.js`, contract test | real token preflight blocked |
| Upsert excludes tags | yes | yes | unit | PASS | contract test | none known in new client |
| `createNewIfDuplicateAllowed:false` | yes | yes | unit | PASS | contract test | Location duplicate policy manual check |
| Separate tag call | yes | yes | mock/contract only | PASS-PARTIAL | `addTags()` | real API not called |
| Turnstile fail closed | yes | yes | code inspection | PASS-PARTIAL | missing secret throws config error | full Siteverify matrix not yet automated |
| CRM authoritative success | yes | yes | code inspection | PASS | lead success occurs after CRM upsert/tag | opportunity not implemented |
| Persistent idempotency | yes | yes | unit + schema | PASS-PARTIAL | D1 schema + unique PK + concurrency test | D1 not provisioned/bound |
| Concurrent duplicate defense | yes | yes | unit | PASS | parallel acquire test | D1 live concurrency not tested |
| Partial saga resume | desired | no | no | FAIL | reconciliation runbook states limitation | automatic resume engine missing |
| Preview isolation | desired | docs only | no | BLOCKED | ADR-004/checklist | separate D1/CRM test config not provisioned |
| API no-store | yes | yes | unit | PASS | contract test | preview/live matrix blocked |
| Passive health | yes | yes | code inspection | PASS | no upstream calls/config disclosure | live test blocked |
| Kill switch | yes | yes | code inspection | PASS | `LEAD_SUBMISSIONS_ENABLED` defaults false | Cloud variable not configured |
| Security headers | yes | yes | unit + inspection | PASS-PARTIAL | Worker helper + `_headers` | live CSP compatibility untested |
| Action SHA pinning | yes | yes | scanner | PASS | `npm run audit:actions` | future workflow additions gated by CI only after CI runs |
| Secret scan | yes | yes | scanner | PASS | source + `dist` scan | high-confidence patterns only |
| Reproducible npm install | desired | no | attempted | BLOCKED | no lockfile in source ZIP | supply-chain gate incomplete |
| Wrangler validation | desired | no | attempted | BLOCKED | dependency unavailable | config not validated by Wrangler |
| Git evidence | desired | no | no | BLOCKED | `.git` absent from ZIP | SHA/branch/diff cannot be proven |
| Production deploy | prohibited | no | no | NOT_APPLICABLE | none performed | external configuration remains |
| Rollback drill | desired later | docs | no | BLOCKED | `docs/ROLLBACK.md` | requires safe authorized environment |

## Readiness
`READY_FOR_SECRETS=false` — npm reproducibility/Wrangler validation and complete critical test matrix are not proven.

`READY_FOR_PREVIEW=false` — preview D1/config isolation is not provisioned and no preview smoke test ran.

`READY_FOR_PRODUCTION=false` — secrets/preflight/preview/provenance/rollback drill are absent and partial-saga resume remains incomplete.
