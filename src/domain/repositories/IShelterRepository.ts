/**
 * IShelterRepository — repository interface for Shelter persistence.
 *
 * Describes WHAT operations exist. Implementation lives in infrastructure/.
 *
 * LAYER: domain — zero external dependencies.
 */

import type { Shelter } from '../entities/Shelter.js';
import type { ShelterId } from '../value-objects/ShelterId.js';

export interface IShelterRepository {
  /** Persist a new or updated shelter. */
  save(shelter: Shelter): Promise<void>;

  /** Retrieve a single shelter by its identity. Returns null if not found. */
  findById(id: ShelterId): Promise<Shelter | null>;

  /** Retrieve all shelters, ordered by name ascending. */
  findAll(): Promise<Shelter[]>;

  /** Remove a shelter permanently. */
  delete(id: ShelterId): Promise<void>;

  /** Check whether a shelter with this id exists. */
  exists(id: ShelterId): Promise<boolean>;
}
