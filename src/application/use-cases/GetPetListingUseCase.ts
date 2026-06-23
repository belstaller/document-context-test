/**
 * GetPetListingUseCase — retrieves a single pet listing by id.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import { PetListingNotFoundException } from '../../domain/exceptions/DomainException.js';
import type { IPetListingRepository } from '../../domain/repositories/IPetListingRepository.js';
import { PetListingId } from '../../domain/value-objects/PetListingId.js';
import type { GetPetListingDto, PetListingResponseDto } from '../dtos/PetListingDto.js';
import { PetListingMapper } from '../mappers/PetListingMapper.js';

export class GetPetListingUseCase {
  constructor(private readonly petListingRepository: IPetListingRepository) {}

  async execute(dto: GetPetListingDto): Promise<PetListingResponseDto> {
    const id = PetListingId.of(dto.listingId);
    const listing = await this.petListingRepository.findById(id);

    if (!listing) {
      throw new PetListingNotFoundException(dto.listingId);
    }

    return PetListingMapper.toResponseDto(listing);
  }
}
