/**
 * ShelterMapper — converts between Shelter domain entities and DTOs.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import type { Shelter } from '../../domain/entities/Shelter.js';
import type { ShelterResponseDto } from '../dtos/ShelterDto.js';

export class ShelterMapper {
  static toResponseDto(shelter: Shelter): ShelterResponseDto {
    return {
      id: shelter.id.value,
      name: shelter.name,
      email: shelter.email,
      phone: shelter.phone,
      website: shelter.website,
      addressLine1: shelter.addressLine1,
      addressLine2: shelter.addressLine2,
      city: shelter.city,
      state: shelter.state,
      postcode: shelter.postcode,
      country: shelter.country,
      latitude: shelter.latitude,
      longitude: shelter.longitude,
      operatingHours: { ...shelter.operatingHours },
      createdAt: shelter.createdAt.toISOString(),
      updatedAt: shelter.updatedAt.toISOString(),
    };
  }

  static toResponseDtoList(shelters: Shelter[]): ShelterResponseDto[] {
    return shelters.map(ShelterMapper.toResponseDto);
  }
}
