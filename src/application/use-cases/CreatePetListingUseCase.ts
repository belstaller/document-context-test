/**
 * CreatePetListingUseCase — creates a new active pet listing for a shelter.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import { PetListing } from '../../domain/entities/PetListing.js';
import type { IPetListingRepository } from '../../domain/repositories/IPetListingRepository.js';
import { PetAge } from '../../domain/value-objects/PetAge.js';
import { PetListingId } from '../../domain/value-objects/PetListingId.js';
import { ShelterId } from '../../domain/value-objects/ShelterId.js';
import type { CreatePetListingDto, PetListingResponseDto } from '../dtos/PetListingDto.js';
import { PetListingMapper } from '../mappers/PetListingMapper.js';

export class CreatePetListingUseCase {
  constructor(private readonly petListingRepository: IPetListingRepository) {}

  async execute(dto: CreatePetListingDto): Promise<PetListingResponseDto> {
    const shelterId = ShelterId.of(dto.shelterId);
    const ageMonths = PetAge.of(dto.ageMonths);

    const listing = PetListing.create({
      id: PetListingId.generate(),
      shelterId,
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      ageMonths,
      healthStatus: {
        vaccinated: dto.vaccinated,
        neuteredOrSpayed: dto.neuteredOrSpayed,
        microchipped: dto.microchipped,
      },
      photos: dto.photos,
    });

    await this.petListingRepository.save(listing);

    return PetListingMapper.toResponseDto(listing);
  }
}
