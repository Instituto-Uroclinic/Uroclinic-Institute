# Rollback

`wrangler tail` / deployment tail is observability, not rollback.

For production, identify the current deployment and the last known-good **successful production deployment**, confirm its ID, use Cloudflare's supported deployment rollback operation/dashboard, then verify `/api/health`, `/`, static assets, canonical redirect and rejection-only `/api/lead` smoke tests. Record old/new deployment IDs and Git SHAs in the deployment manifest.

No production rollback was executed during 111X preparation.
