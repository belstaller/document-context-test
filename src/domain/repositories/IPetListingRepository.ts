/**
 * IPetListingRepository — repository interface for PetListing persistence.
 *
 * Describes WHAT operations exist. Implementation lives in infrastructure/.
 *
 * LAYER: domain — zero external dependencies.
 */

import type { PetListing } from '../entities/PetListing.js';
import type { PetListingId } from '../value-objects/PetListingId.js';
import type { ShelterId } from '../value-objects/ShelterId.js';

export interface IPetListingRepository {
  /** Persist a new or updated pet listing. */
  save(listing: PetListing): Promise<void>;

  /** Retrieve a single pet listing by its identity. Returns null if not found. */
  findById(id: PetListingId): Promise<PetListing | null>;

  /** Retrieve all listings belonging to a given shelter. */
  findByShelterId(shelterId: ShelterId): Promise<PetListing[]>;

  /** Remove a pet listing permanently. */
  delete(id: PetListingId): Promise<void>;

  /** Check whether a pet listing exists. */
  exists(id: PetListingId): Promise<boolean>;
}
