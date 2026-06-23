/**
 * ArchivePetListingUseCase — archives a pet listing, preventing further modifications.
 *
 * Only the owning shelter may archive its own listings.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import {
  PetListingNotFoundException,
  UnauthorisedAccessException,
} from '../../domain/exceptions/DomainException.js';
import type { IPetListingRepository } from '../../domain/repositories/IPetListingRepository.js';
import { PetListingId } from '../../domain/value-objects/PetListingId.js';
import { ShelterId } from '../../domain/value-objects/ShelterId.js';
import type { ArchivePetListingDto, PetListingResponseDto } from '../dtos/PetListingDto.js';
import { PetListingMapper } from '../mappers/PetListingMapper.js';

export class ArchivePetListingUseCase {
  constructor(private readonly petListingRepository: IPetListingRepository) {}

  async execute(dto: ArchivePetListingDto): Promise<PetListingResponseDto> {
    const id = PetListingId.of(dto.listingId);
    const listing = await this.petListingRepository.findById(id);

    if (!listing) {
      throw new PetListingNotFoundException(dto.listingId);
    }

    const requestingShelterId = ShelterId.of(dto.shelterId);
    if (!listing.shelterId.equals(requestingShelterId)) {
      throw new UnauthorisedAccessException(
        'Only the owning shelter can archive this pet listing.',
      );
    }

    listing.archive();

    await this.petListingRepository.save(listing);

    return PetListingMapper.toResponseDto(listing);
  }
}
