/**
 * Document-related DTOs.
 *
 * Plain data objects that cross layer boundaries.
 * Use cases accept input DTOs and return output DTOs — never raw domain entities.
 *
 * LAYER: application
 */

// ─── Input DTOs ─────────────────────────────────────────────────────────────

export interface CreateDocumentDto {
  title: string;
  content: string;
  /** UUID of the authenticated user creating the document. */
  requestingUserId: string;
}

export interface UpdateDocumentDto {
  documentId: string;
  title?: string;
  content?: string;
  /** UUID of the authenticated user performing the update. */
  requestingUserId: string;
}

export interface PublishDocumentDto {
  documentId: string;
  requestingUserId: string;
}

export interface ArchiveDocumentDto {
  documentId: string;
  requestingUserId: string;
}

export interface GetDocumentDto {
  documentId: string;
  requestingUserId: string;
}

export interface ListUserDocumentsDto {
  ownerId: string;
}

// ─── Output DTOs ─────────────────────────────────────────────────────────────

export interface DocumentResponseDto {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}
