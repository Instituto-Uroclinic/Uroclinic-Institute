CREATE TABLE IF NOT EXISTS lead_submissions (
  submission_id TEXT PRIMARY KEY NOT NULL,
  payload_hash TEXT NOT NULL,
  state TEXT NOT NULL,
  contact_id TEXT,
  opportunity_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_lead_state_updated ON lead_submissions(state, updated_at);
