/**
 * PostgresShelterRepository — PostgreSQL implementation of IShelterRepository.
 *
 * Maps between raw DB rows and domain entities.
 * Never leaks pg types or SQL into the application or domain layers.
 *
 * LAYER: infrastructure
 */

import { DAYS_OF_WEEK, Shelter } from '../../domain/entities/Shelter.js';
import type { DayHours, DayOfWeek, OperatingHours } from '../../domain/entities/Shelter.js';
import type { IShelterRepository } from '../../domain/repositories/IShelterRepository.js';
import { ShelterId } from '../../domain/value-objects/ShelterId.js';
import type { DatabaseClient } from '../database/DatabaseClient.js';

interface ShelterRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postcode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  operating_hours: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export class PostgresShelterRepository implements IShelterRepository {
  constructor(private readonly db: DatabaseClient) {}

  async save(shelter: Shelter): Promise<void> {
    const sql = `
      INSERT INTO shelters (
        id, name, email, phone, website,
        address_line1, address_line2, city, state, postcode, country,
        latitude, longitude, operating_hours,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (id) DO UPDATE
        SET name             = EXCLUDED.name,
            email            = EXCLUDED.email,
            phone            = EXCLUDED.phone,
            website          = EXCLUDED.website,
            address_line1    = EXCLUDED.address_line1,
            address_line2    = EXCLUDED.address_line2,
            city             = EXCLUDED.city,
            state            = EXCLUDED.state,
            postcode         = EXCLUDED.postcode,
            country          = EXCLUDED.country,
            latitude         = EXCLUDED.latitude,
            longitude        = EXCLUDED.longitude,
            operating_hours  = EXCLUDED.operating_hours,
            updated_at       = EXCLUDED.updated_at
    `;
    await this.db.query(sql, [
      shelter.id.value,
      shelter.name,
      shelter.email,
      shelter.phone,
      shelter.website,
      shelter.addressLine1,
      shelter.addressLine2,
      shelter.city,
      shelter.state,
      shelter.postcode,
      shelter.country,
      shelter.latitude,
      shelter.longitude,
      JSON.stringify(shelter.operatingHours),
      shelter.createdAt,
      shelter.updatedAt,
    ]);
  }

  async findById(id: ShelterId): Promise<Shelter | null> {
    const rows = await this.db.query<ShelterRow>(
      'SELECT * FROM shelters WHERE id = $1 LIMIT 1',
      [id.value],
    );
    const row = rows[0];
    return row ? this.toDomain(row) : null;
  }

  async findAll(): Promise<Shelter[]> {
    const rows = await this.db.query<ShelterRow>(
      'SELECT * FROM shelters ORDER BY name ASC',
      [],
    );
    return rows.map((r) => this.toDomain(r));
  }

  async delete(id: ShelterId): Promise<void> {
    await this.db.query('DELETE FROM shelters WHERE id = $1', [id.value]);
  }

  async exists(id: ShelterId): Promise<boolean> {
    const rows = await this.db.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM shelters WHERE id = $1',
      [id.value],
    );
    return parseInt(rows[0]?.count ?? '0', 10) > 0;
  }

  // ─── Mapping ─────────────────────────────────────────────────────────────────

  private toDomain(row: ShelterRow): Shelter {
    return Shelter.reconstitute({
      id: ShelterId.of(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone,
      website: row.website,
      addressLine1: row.address_line1,
      addressLine2: row.address_line2,
      city: row.city,
      state: row.state,
      postcode: row.postcode,
      country: row.country,
      latitude: row.latitude,
      longitude: row.longitude,
      operatingHours: this.parseOperatingHours(row.operating_hours),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  private parseOperatingHours(raw: Record<string, unknown>): OperatingHours {
    const defaultHours: OperatingHours = Object.fromEntries(
      DAYS_OF_WEEK.map((d) => [d, { open: null, close: null }]),
    ) as OperatingHours;

    for (const day of DAYS_OF_WEEK) {
      const entry = raw[day];
      if (
        entry !== null &&
        typeof entry === 'object' &&
        !Array.isArray(entry) &&
        'open' in entry &&
        'close' in entry
      ) {
        const { open, close } = entry as { open: unknown; close: unknown };
        defaultHours[day] = {
          open: typeof open === 'string' ? open : null,
          close: typeof close === 'string' ? close : null,
        } satisfies DayHours;
      }
    }

    return defaultHours;
  }
}
