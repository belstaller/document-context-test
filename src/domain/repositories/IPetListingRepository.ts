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

export interface PetListingFilters {
  species?: string;
  breed?: string;
  ageMin?: number;
  ageMax?: number;
}

export interface PetListingPage {
  items: PetListing[];
  total: number;
}

export interface IPetListingRepository {
  /** Persist a new or updated pet listing. */
  save(listing: PetListing): Promise<void>;

  /** Retrieve a single pet listing by its identity. Returns null if not found. */
  findById(id: PetListingId): Promise<PetListing | null>;

  /** Retrieve all listings belonging to a given shelter. */
  findByShelterId(shelterId: ShelterId): Promise<PetListing[]>;

  /**
   * Retrieve a paginated, filtered list of active pet listings across all shelters.
   * @param filters  Optional column filters (case-insensitive LIKE matching).
   * @param page     Zero-based page index.
   * @param limit    Page size (1–100).
   */
  findActive(filters: PetListingFilters, page: number, limit: number): Promise<PetListingPage>;

  /** Remove a pet listing permanently. */
  delete(id: PetListingId): Promise<void>;

  /** Check whether a pet listing exists. */
  exists(id: PetListingId): Promise<boolean>;
}
