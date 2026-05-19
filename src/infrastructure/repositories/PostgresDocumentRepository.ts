/**
 * PostgresDocumentRepository — PostgreSQL implementation of IDocumentRepository.
 *
 * Maps between raw DB rows and domain entities.
 * Never leaks pg types or SQL into the application or domain layers.
 *
 * LAYER: infrastructure
 */

import { Document } from '../../domain/entities/Document.js';
import type { DocumentStatus } from '../../domain/entities/Document.js';
import type { IDocumentRepository } from '../../domain/repositories/IDocumentRepository.js';
import { DocumentId } from '../../domain/value-objects/DocumentId.js';
import { DocumentTitle } from '../../domain/value-objects/DocumentTitle.js';
import { OwnerId } from '../../domain/value-objects/OwnerId.js';
import type { DatabaseClient } from '../database/DatabaseClient.js';

interface DocumentRow {
  id: string;
  title: string;
  content: string;
  owner_id: string;
  status: DocumentStatus;
  created_at: Date;
  updated_at: Date;
}

export class PostgresDocumentRepository implements IDocumentRepository {
  constructor(private readonly db: DatabaseClient) {}

  async save(document: Document): Promise<void> {
    const sql = `
      INSERT INTO documents (id, title, content, owner_id, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE
        SET title      = EXCLUDED.title,
            content    = EXCLUDED.content,
            status     = EXCLUDED.status,
            updated_at = EXCLUDED.updated_at
    `;
    await this.db.query(sql, [
      document.id.value,
      document.title.value,
      document.content,
      document.ownerId.value,
      document.status,
      document.createdAt,
      document.updatedAt,
    ]);
  }

  async findById(id: DocumentId): Promise<Document | null> {
    const rows = await this.db.query<DocumentRow>(
      'SELECT * FROM documents WHERE id = $1 LIMIT 1',
      [id.value],
    );
    const row = rows[0];
    return row ? this.toDomain(row) : null;
  }

  async findByOwnerId(ownerId: OwnerId): Promise<Document[]> {
    const rows = await this.db.query<DocumentRow>(
      'SELECT * FROM documents WHERE owner_id = $1 ORDER BY created_at DESC',
      [ownerId.value],
    );
    return rows.map((r) => this.toDomain(r));
  }

  async delete(id: DocumentId): Promise<void> {
    await this.db.query('DELETE FROM documents WHERE id = $1', [id.value]);
  }

  async exists(id: DocumentId): Promise<boolean> {
    const rows = await this.db.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM documents WHERE id = $1',
      [id.value],
    );
    return parseInt(rows[0]?.count ?? '0', 10) > 0;
  }

  // ─── Mapping ─────────────────────────────────────────────────────────────

  private toDomain(row: DocumentRow): Document {
    return Document.reconstitute({
      id: DocumentId.of(row.id),
      title: DocumentTitle.of(row.title),
      content: row.content,
      ownerId: OwnerId.of(row.owner_id),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
