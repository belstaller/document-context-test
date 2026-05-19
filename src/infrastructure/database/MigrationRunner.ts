/**
 * MigrationRunner — applies SQL migration files in order.
 *
 * A lightweight alternative to a full ORM migration tool.
 * Reads *.sql files from the migrations/ directory and applies any
 * that have not yet been recorded in the schema_migrations table.
 *
 * LAYER: infrastructure
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DatabaseClient } from './DatabaseClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class MigrationRunner {
  private readonly db: DatabaseClient;

  constructor(db: DatabaseClient) {
    this.db = db;
  }

  async run(): Promise<void> {
    await this.ensureMigrationsTable();

    const applied = await this.getAppliedMigrations();
    const files = this.getMigrationFiles();

    for (const file of files) {
      if (applied.has(file)) {
        continue;
      }

      const sql = fs.readFileSync(path.join(__dirname, 'migrations', file), 'utf-8');
      console.log(`[MigrationRunner] Applying: ${file}`);

      await this.db.withTransaction(async (client) => {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      });

      console.log(`[MigrationRunner] Applied: ${file}`);
    }
  }

  private async ensureMigrationsTable(): Promise<void> {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename    VARCHAR(255) PRIMARY KEY,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  }

  private async getAppliedMigrations(): Promise<Set<string>> {
    const rows = await this.db.query<{ filename: string }>('SELECT filename FROM schema_migrations');
    return new Set(rows.map((r) => r.filename));
  }

  private getMigrationFiles(): string[] {
    const dir = path.join(__dirname, 'migrations');
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.sql'))
      .sort();
  }
}
