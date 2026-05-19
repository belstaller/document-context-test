/**
 * Document — core domain entity.
 *
 * Protects its own invariants. Has identity (id) and a lifecycle
 * (draft → published → archived).
 *
 * LAYER: domain — zero external dependencies.
 */

import type { DocumentId } from '../value-objects/DocumentId.js';
import type { DocumentTitle } from '../value-objects/DocumentTitle.js';
import type { OwnerId } from '../value-objects/OwnerId.js';

export type DocumentStatus = 'draft' | 'published' | 'archived';

export interface DocumentProps {
  id: DocumentId;
  title: DocumentTitle;
  content: string;
  ownerId: OwnerId;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Document {
  private readonly _id: DocumentId;
  private _title: DocumentTitle;
  private _content: string;
  private readonly _ownerId: OwnerId;
  private _status: DocumentStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: DocumentProps) {
    this._id = props.id;
    this._title = props.title;
    this._content = props.content;
    this._ownerId = props.ownerId;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // ─── Factory ────────────────────────────────────────────────────────────────

  static create(props: Omit<DocumentProps, 'createdAt' | 'updatedAt' | 'status'>): Document {
    const now = new Date();
    return new Document({
      ...props,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: DocumentProps): Document {
    return new Document(props);
  }

  // ─── Accessors ──────────────────────────────────────────────────────────────

  get id(): DocumentId {
    return this._id;
  }

  get title(): DocumentTitle {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get ownerId(): OwnerId {
    return this._ownerId;
  }

  get status(): DocumentStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ─── Behaviour ──────────────────────────────────────────────────────────────

  updateTitle(title: DocumentTitle): void {
    this.guardNotArchived();
    this._title = title;
    this._updatedAt = new Date();
  }

  updateContent(content: string): void {
    this.guardNotArchived();
    if (content.trim().length === 0) {
      throw new Error('Document content cannot be empty.');
    }
    this._content = content;
    this._updatedAt = new Date();
  }

  publish(): void {
    if (this._status === 'published') {
      throw new Error('Document is already published.');
    }
    this.guardNotArchived();
    this._status = 'published';
    this._updatedAt = new Date();
  }

  archive(): void {
    if (this._status === 'archived') {
      throw new Error('Document is already archived.');
    }
    this._status = 'archived';
    this._updatedAt = new Date();
  }

  // ─── Guards ─────────────────────────────────────────────────────────────────

  private guardNotArchived(): void {
    if (this._status === 'archived') {
      throw new Error('Cannot modify an archived document.');
    }
  }
}
