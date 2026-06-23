/**
 * ListSheltersUseCase — retrieves all shelters ordered by name.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import type { IShelterRepository } from '../../domain/repositories/IShelterRepository.js';
import type { ShelterResponseDto } from '../dtos/ShelterDto.js';
import { ShelterMapper } from '../mappers/ShelterMapper.js';

export class ListSheltersUseCase {
  constructor(private readonly shelterRepository: IShelterRepository) {}

  async execute(): Promise<ShelterResponseDto[]> {
    const shelters = await this.shelterRepository.findAll();
    return ShelterMapper.toResponseDtoList(shelters);
  }
}
