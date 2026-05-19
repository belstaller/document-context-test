/**
 * DatabaseClient — manages the PostgreSQL connection pool.
 *
 * Uses `pg` (node-postgres). Connection configuration is read exclusively
 * from environment variables — no hardcoded values.
 *
 * LAYER: infrastructure — may import domain/application; never interfaces/.
 */

import { Pool, type PoolClient } from 'pg';

export class DatabaseClient {
  private static instance: DatabaseClient | null = null;
  private readonly pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env['DATABASE_URL'],
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 2_000,
    });

    this.pool.on('error', (err) => {
      // In production wire this to a proper logger.
      console.error('[DatabaseClient] Unexpected error on idle client:', err);
    });
  }

  static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  async query<T extends object = Record<string, unknown>>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    const result = await this.pool.query<T>(sql, params);
    return result.rows;
  }

  async withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
