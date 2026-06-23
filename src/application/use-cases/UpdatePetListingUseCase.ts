/**
 * UpdatePetListingUseCase — updates mutable fields on an existing pet listing.
 *
 * Only the requesting shelter may update its own listings.
 * When photos are provided the full array replaces the current one;
 * individual add/remove operations are handled at the entity level in domain.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import {
  PetListingNotFoundException,
  UnauthorisedAccessException,
} from '../../domain/exceptions/DomainException.js';
import type { IPetListingRepository } from '../../domain/repositories/IPetListingRepository.js';
import { PetAge } from '../../domain/value-objects/PetAge.js';
import { PetListingId } from '../../domain/value-objects/PetListingId.js';
import { ShelterId } from '../../domain/value-objects/ShelterId.js';
import type { PetListingResponseDto, UpdatePetListingDto } from '../dtos/PetListingDto.js';
import { PetListingMapper } from '../mappers/PetListingMapper.js';

export class UpdatePetListingUseCase {
  constructor(private readonly petListingRepository: IPetListingRepository) {}

  async execute(dto: UpdatePetListingDto): Promise<PetListingResponseDto> {
    const id = PetListingId.of(dto.listingId);
    const listing = await this.petListingRepository.findById(id);

    if (!listing) {
      throw new PetListingNotFoundException(dto.listingId);
    }

    const requestingShelterId = ShelterId.of(dto.shelterId);
    if (!listing.shelterId.equals(requestingShelterId)) {
      throw new UnauthorisedAccessException(
        'Only the owning shelter can update this pet listing.',
      );
    }

    // Build scalar update fields — only include keys that were provided,
    // to satisfy exactOptionalPropertyTypes.
    listing.update({
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.species !== undefined && { species: dto.species }),
      ...(dto.breed !== undefined && { breed: dto.breed }),
      ...(dto.ageMonths !== undefined && { ageMonths: PetAge.of(dto.ageMonths) }),
      ...(dto.vaccinated !== undefined ||
      dto.neuteredOrSpayed !== undefined ||
      dto.microchipped !== undefined
        ? {
            healthStatus: {
              ...(dto.vaccinated !== undefined && { vaccinated: dto.vaccinated }),
              ...(dto.neuteredOrSpayed !== undefined && { neuteredOrSpayed: dto.neuteredOrSpayed }),
              ...(dto.microchipped !== undefined && { microchipped: dto.microchipped }),
            },
          }
        : {}),
    });

    // Replace photo array when provided.
    if (dto.photos !== undefined) {
      // Remove all current photos then add the new ones so entity invariants fire.
      for (const url of [...listing.photos]) {
        listing.removePhoto(url);
      }
      for (const url of dto.photos) {
        listing.addPhoto(url);
      }
    }

    await this.petListingRepository.save(listing);

    return PetListingMapper.toResponseDto(listing);
  }
}
