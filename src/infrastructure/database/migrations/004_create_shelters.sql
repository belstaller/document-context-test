-- Migration 004 — create shelters table
-- Run order: 004

CREATE TABLE IF NOT EXISTS shelters (
  id              UUID          PRIMARY KEY,
  name            VARCHAR(150)  NOT NULL,
  email           VARCHAR(255)  NOT NULL,
  phone           VARCHAR(30)   NOT NULL,
  website         VARCHAR(255),
  address_line1   VARCHAR(255)  NOT NULL,
  address_line2   VARCHAR(255),
  city            VARCHAR(100)  NOT NULL,
  state           VARCHAR(100)  NOT NULL,
  postcode        VARCHAR(20)   NOT NULL,
  country         VARCHAR(100)  NOT NULL,
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  operating_hours JSONB         NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shelters_name ON shelters(name);
