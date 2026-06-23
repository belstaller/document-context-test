/**
 * ListPetListingsUseCase — retrieves a paginated, filtered list of active pet listings
 * across all shelters for the public browsing page.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import type { IPetListingRepository } from '../../domain/repositories/IPetListingRepository.js';
import type {
  ListPetListingsDto,
  PetListingsPageDto,
} from '../dtos/PetListingDto.js';
import { PetListingMapper } from '../mappers/PetListingMapper.js';

const DEFAULT_PAGE = 0;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;

export class ListPetListingsUseCase {
  constructor(private readonly petListingRepository: IPetListingRepository) {}

  async execute(dto: ListPetListingsDto): Promise<PetListingsPageDto> {
    const page = Math.max(0, dto.page ?? DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, dto.limit ?? DEFAULT_LIMIT));

    const filters = {
      ...(dto.species !== undefined && { species: dto.species }),
      ...(dto.breed !== undefined && { breed: dto.breed }),
      ...(dto.ageMin !== undefined && { ageMin: dto.ageMin }),
      ...(dto.ageMax !== undefined && { ageMax: dto.ageMax }),
    };

    const { items, total } = await this.petListingRepository.findActive(filters, page, limit);

    return {
      items: PetListingMapper.toResponseDtoList(items),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
