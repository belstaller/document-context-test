/**
 * IDocumentRepository — repository interface for Document persistence.
 *
 * Describes WHAT operations exist. Implementation lives in infrastructure/.
 *
 * LAYER: domain — zero external dependencies.
 */

import type { Document } from '../entities/Document.js';
import type { DocumentId } from '../value-objects/DocumentId.js';
import type { OwnerId } from '../value-objects/OwnerId.js';

export interface IDocumentRepository {
  /** Persist a new or updated document. */
  save(document: Document): Promise<void>;

  /** Retrieve a single document by its identity. Returns null if not found. */
  findById(id: DocumentId): Promise<Document | null>;

  /** Retrieve all documents owned by a given user. */
  findByOwnerId(ownerId: OwnerId): Promise<Document[]>;

  /** Remove a document permanently. */
  delete(id: DocumentId): Promise<void>;

  /** Check whether a document exists. */
  exists(id: DocumentId): Promise<boolean>;
}
