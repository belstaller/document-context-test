/**
 * UserMapper — converts between User domain entities and DTOs.
 *
 * LAYER: application
 */

import type { User } from '../../domain/entities/User.js';
import type { UserResponseDto } from '../dtos/UserDto.js';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id.value,
      email: user.email.value,
      displayName: user.displayName,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
