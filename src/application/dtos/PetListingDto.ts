/**
 * Pet-listing-related DTOs.
 *
 * Plain data objects that cross layer boundaries.
 * Use cases accept input DTOs and return output DTOs — never raw domain entities.
 *
 * LAYER: application
 */

// ─── Input DTOs ──────────────────────────────────────────────────────────────

export interface CreatePetListingDto {
  /** UUID of the shelter creating the listing. */
  shelterId: string;
  name: string;
  species: string;
  breed: string;
  /** Age expressed in whole months. */
  ageMonths: number;
  vaccinated: boolean;
  neuteredOrSpayed: boolean;
  microchipped: boolean;
  /** Photo URLs — maximum 10. */
  photos: string[];
}

export interface UpdatePetListingDto {
  listingId: string;
  /** UUID of the shelter that owns the listing. */
  shelterId: string;
  name?: string;
  species?: string;
  breed?: string;
  ageMonths?: number;
  vaccinated?: boolean;
  neuteredOrSpayed?: boolean;
  microchipped?: boolean;
  /** Full replacement of the photo array — maximum 10. */
  photos?: string[];
}

export interface ArchivePetListingDto {
  listingId: string;
  /** UUID of the shelter that owns the listing. */
  shelterId: string;
}

export interface GetPetListingDto {
  listingId: string;
}

export interface ListShelterPetListingsDto {
  shelterId: string;
}

// ─── Output DTOs ─────────────────────────────────────────────────────────────

export interface PetListingResponseDto {
  id: string;
  shelterId: string;
  name: string;
  species: string;
  breed: string;
  ageMonths: number;
  vaccinated: boolean;
  neuteredOrSpayed: boolean;
  microchipped: boolean;
  photos: string[];
  status: 'active' | 'archived';
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}
