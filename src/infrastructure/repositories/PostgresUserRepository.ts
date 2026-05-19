/**
 * PostgresUserRepository — PostgreSQL implementation of IUserRepository.
 *
 * LAYER: infrastructure
 */

import { User } from '../../domain/entities/User.js';
import type { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { EmailAddress } from '../../domain/value-objects/EmailAddress.js';
import { OwnerId } from '../../domain/value-objects/OwnerId.js';
import type { DatabaseClient } from '../database/DatabaseClient.js';

interface UserRow {
  id: string;
  email: string;
  display_name: string;
  created_at: Date;
}

export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly db: DatabaseClient) {}

  async save(user: User): Promise<void> {
    const sql = `
      INSERT INTO users (id, email, display_name, created_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE
        SET email        = EXCLUDED.email,
            display_name = EXCLUDED.display_name
    `;
    await this.db.query(sql, [
      user.id.value,
      user.email.value,
      user.displayName,
      user.createdAt,
    ]);
  }

  async findById(id: OwnerId): Promise<User | null> {
    const rows = await this.db.query<UserRow>('SELECT * FROM users WHERE id = $1 LIMIT 1', [
      id.value,
    ]);
    const row = rows[0];
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: EmailAddress): Promise<User | null> {
    const rows = await this.db.query<UserRow>(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email.value],
    );
    const row = rows[0];
    return row ? this.toDomain(row) : null;
  }

  async exists(id: OwnerId): Promise<boolean> {
    const rows = await this.db.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM users WHERE id = $1',
      [id.value],
    );
    return parseInt(rows[0]?.count ?? '0', 10) > 0;
  }

  private toDomain(row: UserRow): User {
    return User.reconstitute({
      id: OwnerId.of(row.id),
      email: EmailAddress.of(row.email),
      displayName: row.display_name,
      createdAt: row.created_at,
    });
  }
}
