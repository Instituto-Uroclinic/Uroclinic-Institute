# HighLevel preflight

1. Confirm the production Sub-Account/Location ID.
2. In HighLevel Location settings, inspect **Allow Duplicate Contact** and its Email/Phone matching priority. The Upsert API explicitly follows this Location-level policy.
3. Confirm the Private Integration has `contacts.write` for the two endpoints in `config/highlevel-scope-manifest.json`.
4. Do not add `tags` to `/contacts/upsert`; tags are added only after a contact ID exists.
5. Run a controlled synthetic contact only after explicit authorization.

The repository does not invent an API endpoint for reading duplicate-policy configuration. Until it is verified in the dashboard/API with authorized credentials, this remains `MANUAL_PREDEPLOY_CHECK`.
