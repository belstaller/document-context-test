/**
 * DocumentOwnershipService — domain service encapsulating ownership rules
 * that span both the Document and User entities.
 *
 * Receives all dependencies via the constructor (no service locator).
 *
 * LAYER: domain — zero external dependencies.
 */

import type { Document } from '../entities/Document.js';
import type { OwnerId } from '../value-objects/OwnerId.js';

export class DocumentOwnershipService {
  /**
   * Returns true when the given user is allowed to modify the document.
   * Currently: only the original owner may edit.
   * Extend this for role-based rules without changing use cases.
   */
  canModify(document: Document, requestingUserId: OwnerId): boolean {
    return document.ownerId.equals(requestingUserId);
  }

  /**
   * Throws a domain error when the requesting user cannot modify the document.
   */
  assertCanModify(document: Document, requestingUserId: OwnerId): void {
    if (!this.canModify(document, requestingUserId)) {
      throw new Error(
        `User "${requestingUserId.value}" is not authorised to modify document "${document.id.value}".`,
      );
    }
  }
}
