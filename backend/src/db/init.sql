CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE issue_status AS ENUM ('todo','in_progress','done','cancelled');
CREATE TYPE issue_priority AS ENUM ('low','medium','high');

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS issues (
  issue_no BIGSERIAL UNIQUE,
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status issue_status NOT NULL DEFAULT 'todo',
  priority issue_priority NOT NULL DEFAULT 'medium',
  created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS issue_labels (
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE RESTRICT,
  PRIMARY KEY (issue_id, label_id)
);


CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issue_labels_label_id ON issue_labels(label_id);
