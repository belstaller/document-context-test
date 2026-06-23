/**
 * PostgresPetListingRepository — PostgreSQL implementation of IPetListingRepository.
 *
 * Maps between raw DB rows and domain entities.
 * Never leaks pg types or SQL into the application or domain layers.
 *
 * LAYER: infrastructure
 */

import { PetListing } from '../../domain/entities/PetListing.js';
import type { PetListingStatus } from '../../domain/entities/PetListing.js';
import type {
  IPetListingRepository,
  PetListingFilters,
  PetListingPage,
} from '../../domain/repositories/IPetListingRepository.js';
import { PetAge } from '../../domain/value-objects/PetAge.js';
import { PetListingId } from '../../domain/value-objects/PetListingId.js';
import { ShelterId } from '../../domain/value-objects/ShelterId.js';
import type { DatabaseClient } from '../database/DatabaseClient.js';

interface PetListingRow {
  id: string;
  shelter_id: string;
  name: string;
  species: string;
  breed: string;
  age_months: number;
  vaccinated: boolean;
  neutered_or_spayed: boolean;
  microchipped: boolean;
  photos: string[];
  status: PetListingStatus;
  created_at: Date;
  updated_at: Date;
}

export class PostgresPetListingRepository implements IPetListingRepository {
  constructor(private readonly db: DatabaseClient) {}

  async save(listing: PetListing): Promise<void> {
    const sql = `
      INSERT INTO pet_listings (
        id, shelter_id, name, species, breed, age_months,
        vaccinated, neutered_or_spayed, microchipped,
        photos, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE
        SET name               = EXCLUDED.name,
            species            = EXCLUDED.species,
            breed              = EXCLUDED.breed,
            age_months         = EXCLUDED.age_months,
            vaccinated         = EXCLUDED.vaccinated,
            neutered_or_spayed = EXCLUDED.neutered_or_spayed,
            microchipped       = EXCLUDED.microchipped,
            photos             = EXCLUDED.photos,
            status             = EXCLUDED.status,
            updated_at         = EXCLUDED.updated_at
    `;
    const health = listing.healthStatus;
    await this.db.query(sql, [
      listing.id.value,
      listing.shelterId.value,
      listing.name,
      listing.species,
      listing.breed,
      listing.ageMonths.months,
      health.vaccinated,
      health.neuteredOrSpayed,
      health.microchipped,
      listing.photos,
      listing.status,
      listing.createdAt,
      listing.updatedAt,
    ]);
  }

  async findById(id: PetListingId): Promise<PetListing | null> {
    const rows = await this.db.query<PetListingRow>(
      'SELECT * FROM pet_listings WHERE id = $1 LIMIT 1',
      [id.value],
    );
    const row = rows[0];
    return row ? this.toDomain(row) : null;
  }

  async findByShelterId(shelterId: ShelterId): Promise<PetListing[]> {
    const rows = await this.db.query<PetListingRow>(
      'SELECT * FROM pet_listings WHERE shelter_id = $1 ORDER BY created_at DESC',
      [shelterId.value],
    );
    return rows.map((r) => this.toDomain(r));
  }

  async findActive(filters: PetListingFilters, page: number, limit: number): Promise<PetListingPage> {
    const conditions: string[] = ["status = 'active'"];
    const params: unknown[] = [];

    if (filters.species !== undefined) {
      params.push(`%${filters.species}%`);
      conditions.push(`species ILIKE ${params.length}`);
    }
    if (filters.breed !== undefined) {
      params.push(`%${filters.breed}%`);
      conditions.push(`breed ILIKE ${params.length}`);
    }
    if (filters.ageMin !== undefined) {
      params.push(filters.ageMin);
      conditions.push(`age_months >= ${params.length}`);
    }
    if (filters.ageMax !== undefined) {
      params.push(filters.ageMax);
      conditions.push(`age_months <= ${params.length}`);
    }

    const where = conditions.join(' AND ');

    // Count query
    const countRows = await this.db.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM pet_listings WHERE ${where}`,
      params,
    );
    const total = parseInt(countRows[0]?.count ?? '0', 10);

    // Data query
    params.push(limit);
    const limitParam = params.length;
    params.push(page * limit);
    const offsetParam = params.length;

    const rows = await this.db.query<PetListingRow>(
      `SELECT * FROM pet_listings WHERE ${where} ORDER BY created_at DESC LIMIT ${limitParam} OFFSET ${offsetParam}`,
      params,
    );

    return { items: rows.map((r) => this.toDomain(r)), total };
  }

  async delete(id: PetListingId): Promise<void> {
    await this.db.query('DELETE FROM pet_listings WHERE id = $1', [id.value]);
  }

  async exists(id: PetListingId): Promise<boolean> {
    const rows = await this.db.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM pet_listings WHERE id = $1',
      [id.value],
    );
    return parseInt(rows[0]?.count ?? '0', 10) > 0;
  }

  // ─── Mapping ─────────────────────────────────────────────────────────────────

  private toDomain(row: PetListingRow): PetListing {
    return PetListing.reconstitute({
      id: PetListingId.of(row.id),
      shelterId: ShelterId.of(row.shelter_id),
      name: row.name,
      species: row.species,
      breed: row.breed,
      ageMonths: PetAge.of(row.age_months),
      healthStatus: {
        vaccinated: row.vaccinated,
        neuteredOrSpayed: row.neutered_or_spayed,
        microchipped: row.microchipped,
      },
      photos: row.photos,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
