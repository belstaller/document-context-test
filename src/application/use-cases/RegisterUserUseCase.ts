/**
 * RegisterUserUseCase — creates a new user account.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import { User } from '../../domain/entities/User.js';
import type { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { EmailAddress } from '../../domain/value-objects/EmailAddress.js';
import { OwnerId } from '../../domain/value-objects/OwnerId.js';
import type { RegisterUserDto, UserResponseDto } from '../dtos/UserDto.js';
import { UserMapper } from '../mappers/UserMapper.js';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: RegisterUserDto): Promise<UserResponseDto> {
    const email = EmailAddress.of(dto.email);

    // Guard against duplicate registrations.
    const existing = await this.userRepository.findByEmail(email);
    if (existing !== null) {
      throw new Error(`A user with email "${email.value}" already exists.`);
    }

    const user = User.create({
      id: OwnerId.generate(),
      email,
      displayName: dto.displayName,
    });

    await this.userRepository.save(user);

    return UserMapper.toResponseDto(user);
  }
}
