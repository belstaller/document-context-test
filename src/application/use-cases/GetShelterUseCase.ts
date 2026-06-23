/**
 * GetShelterUseCase — retrieves a single shelter by its id.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import { ShelterNotFoundException } from '../../domain/exceptions/DomainException.js';
import type { IShelterRepository } from '../../domain/repositories/IShelterRepository.js';
import { ShelterId } from '../../domain/value-objects/ShelterId.js';
import type { GetShelterDto, ShelterResponseDto } from '../dtos/ShelterDto.js';
import { ShelterMapper } from '../mappers/ShelterMapper.js';

export class GetShelterUseCase {
  constructor(private readonly shelterRepository: IShelterRepository) {}

  async execute(dto: GetShelterDto): Promise<ShelterResponseDto> {
    const shelterId = ShelterId.of(dto.shelterId);
    const shelter = await this.shelterRepository.findById(shelterId);

    if (!shelter) {
      throw new ShelterNotFoundException(dto.shelterId);
    }

    return ShelterMapper.toResponseDto(shelter);
  }
}
