# Credential rotation
Rotate one provider at a time. Create replacement credential → update the Cloudflare runtime secret → verify in a non-production/safe environment → authorize production verification → revoke the previous credential. Never paste credential values into Git, documentation, logs, or deployment manifests.
