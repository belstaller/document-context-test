/**
 * ListShelterPetListingsUseCase — retrieves all pet listings for a given shelter.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import type { IPetListingRepository } from '../../domain/repositories/IPetListingRepository.js';
import { ShelterId } from '../../domain/value-objects/ShelterId.js';
import type { ListShelterPetListingsDto, PetListingResponseDto } from '../dtos/PetListingDto.js';
import { PetListingMapper } from '../mappers/PetListingMapper.js';

export class ListShelterPetListingsUseCase {
  constructor(private readonly petListingRepository: IPetListingRepository) {}

  async execute(dto: ListShelterPetListingsDto): Promise<PetListingResponseDto[]> {
    const shelterId = ShelterId.of(dto.shelterId);
    const listings = await this.petListingRepository.findByShelterId(shelterId);
    return PetListingMapper.toResponseDtoList(listings);
  }
}
