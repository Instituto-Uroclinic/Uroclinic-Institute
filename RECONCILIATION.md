# Reconciliation

D1 is the authoritative idempotency ledger; HighLevel is the authoritative CRM persistence layer. A submission progresses through RECEIVED → SECURITY_VERIFIED → TURNSTILE_VERIFIED → CRM_CONTACT_UPSERTED → CRM_TAGGED → SECONDARY_NOTIFICATIONS_PROCESSED → COMPLETED. Failures are recorded as retryable or terminal.

The current 111X implementation deliberately blocks an in-flight retry instead of automatically resuming a partial saga. Operator-safe resume/reconciliation remains a production blocker before automated recovery can be claimed. Contact creation is protected by the ledger, but a full resume engine for every partial state is not yet implemented.
