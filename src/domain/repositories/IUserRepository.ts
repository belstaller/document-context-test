/**
 * IUserRepository — repository interface for User persistence.
 *
 * LAYER: domain — zero external dependencies.
 */

import type { User } from '../entities/User.js';
import type { EmailAddress } from '../value-objects/EmailAddress.js';
import type { OwnerId } from '../value-objects/OwnerId.js';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: OwnerId): Promise<User | null>;
  findByEmail(email: EmailAddress): Promise<User | null>;
  exists(id: OwnerId): Promise<boolean>;
}
