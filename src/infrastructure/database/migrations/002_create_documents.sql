-- Migration 002 — create documents table
-- Run order: 002

CREATE TYPE document_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE IF NOT EXISTS documents (
  id          UUID            PRIMARY KEY,
  title       VARCHAR(200)    NOT NULL,
  content     TEXT            NOT NULL DEFAULT '',
  owner_id    UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status      document_status NOT NULL DEFAULT 'draft',
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_owner_id ON documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_status   ON documents(status);
