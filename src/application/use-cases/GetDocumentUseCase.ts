/**
 * GetDocumentUseCase — retrieves a single document by id.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import {
  DocumentNotFoundException,
  UnauthorisedAccessException,
} from '../../domain/exceptions/DomainException.js';
import type { IDocumentRepository } from '../../domain/repositories/IDocumentRepository.js';
import { DocumentOwnershipService } from '../../domain/services/DocumentOwnershipService.js';
import { DocumentId } from '../../domain/value-objects/DocumentId.js';
import { OwnerId } from '../../domain/value-objects/OwnerId.js';
import type { DocumentResponseDto, GetDocumentDto } from '../dtos/DocumentDto.js';
import { DocumentMapper } from '../mappers/DocumentMapper.js';

export class GetDocumentUseCase {
  private readonly ownershipService = new DocumentOwnershipService();

  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(dto: GetDocumentDto): Promise<DocumentResponseDto> {
    const docId = DocumentId.of(dto.documentId);
    const document = await this.documentRepository.findById(docId);

    if (!document) {
      throw new DocumentNotFoundException(dto.documentId);
    }

    const requestingUserId = OwnerId.of(dto.requestingUserId);
    if (!this.ownershipService.canModify(document, requestingUserId)) {
      // Only published documents are publicly readable; drafts are private.
      if (document.status !== 'published') {
        throw new UnauthorisedAccessException(
          `You do not have access to document "${dto.documentId}".`,
        );
      }
    }

    return DocumentMapper.toResponseDto(document);
  }
}
