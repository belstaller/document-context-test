-- Seed 001 — example shelters for development
-- Safe to re-run (uses ON CONFLICT DO NOTHING)

INSERT INTO shelters (
  id,
  name,
  email,
  phone,
  website,
  address_line1,
  city,
  state,
  postcode,
  country,
  latitude,
  longitude,
  operating_hours
) VALUES
(
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Happy Paws Shelter',
  'hello@happypaws.example',
  '+1-555-100-2000',
  'https://happypaws.example',
  '14 Elm Street',
  'Austin',
  'TX',
  '78701',
  'USA',
  30.2672,
  -97.7431,
  '{
    "monday":    {"open": "09:00", "close": "17:00"},
    "tuesday":   {"open": "09:00", "close": "17:00"},
    "wednesday": {"open": "09:00", "close": "17:00"},
    "thursday":  {"open": "09:00", "close": "17:00"},
    "friday":    {"open": "09:00", "close": "17:00"},
    "saturday":  {"open": "10:00", "close": "15:00"},
    "sunday":    {"open": null,    "close": null}
  }'
),
(
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Second Chances Animal Rescue',
  'adopt@secondchances.example',
  '+1-555-200-3000',
  NULL,
  '88 Oak Avenue',
  'Portland',
  'OR',
  '97201',
  'USA',
  45.5051,
  -122.6750,
  '{
    "monday":    {"open": null,    "close": null},
    "tuesday":   {"open": "10:00", "close": "18:00"},
    "wednesday": {"open": "10:00", "close": "18:00"},
    "thursday":  {"open": "10:00", "close": "18:00"},
    "friday":    {"open": "10:00", "close": "18:00"},
    "saturday":  {"open": "09:00", "close": "16:00"},
    "sunday":    {"open": "12:00", "close": "16:00"}
  }'
)
ON CONFLICT (id) DO NOTHING;
