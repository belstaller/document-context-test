-- Migration 001 — create users table
-- Run order: 001

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY,
  email         VARCHAR(320) NOT NULL UNIQUE,
  display_name  VARCHAR(200) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
