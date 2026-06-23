/**
 * PetListingMapper — converts between PetListing domain entities and DTOs.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import type { PetListing } from '../../domain/entities/PetListing.js';
import type { PetListingResponseDto } from '../dtos/PetListingDto.js';

export class PetListingMapper {
  static toResponseDto(listing: PetListing): PetListingResponseDto {
    const health = listing.healthStatus;
    return {
      id: listing.id.value,
      shelterId: listing.shelterId.value,
      name: listing.name,
      species: listing.species,
      breed: listing.breed,
      ageMonths: listing.ageMonths.months,
      vaccinated: health.vaccinated,
      neuteredOrSpayed: health.neuteredOrSpayed,
      microchipped: health.microchipped,
      photos: [...listing.photos],
      status: listing.status,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    };
  }

  static toResponseDtoList(listings: PetListing[]): PetListingResponseDto[] {
    return listings.map(PetListingMapper.toResponseDto);
  }
}
