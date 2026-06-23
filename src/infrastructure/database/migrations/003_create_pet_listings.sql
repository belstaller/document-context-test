-- Migration 003 — create pet_listings table
-- Run order: 003

CREATE TYPE pet_listing_status AS ENUM ('active', 'archived');

CREATE TABLE IF NOT EXISTS pet_listings (
  id                UUID                PRIMARY KEY,
  shelter_id        UUID                NOT NULL,
  name              VARCHAR(100)        NOT NULL,
  species           VARCHAR(100)        NOT NULL,
  breed             VARCHAR(100)        NOT NULL,
  age_months        INTEGER             NOT NULL CHECK (age_months >= 0),
  vaccinated        BOOLEAN             NOT NULL DEFAULT FALSE,
  neutered_or_spayed BOOLEAN            NOT NULL DEFAULT FALSE,
  microchipped      BOOLEAN             NOT NULL DEFAULT FALSE,
  photos            TEXT[]              NOT NULL DEFAULT '{}',
  status            pet_listing_status  NOT NULL DEFAULT 'active',
  created_at        TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pet_listings_shelter_id ON pet_listings(shelter_id);
CREATE INDEX IF NOT EXISTS idx_pet_listings_status     ON pet_listings(status);
