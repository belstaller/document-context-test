/**
 * UpdateDocumentUseCase — updates the title and/or content of an existing document.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import { DocumentNotFoundException } from '../../domain/exceptions/DomainException.js';
import type { IDocumentRepository } from '../../domain/repositories/IDocumentRepository.js';
import { DocumentOwnershipService } from '../../domain/services/DocumentOwnershipService.js';
import { DocumentId } from '../../domain/value-objects/DocumentId.js';
import { DocumentTitle } from '../../domain/value-objects/DocumentTitle.js';
import { OwnerId } from '../../domain/value-objects/OwnerId.js';
import type { DocumentResponseDto, UpdateDocumentDto } from '../dtos/DocumentDto.js';
import { DocumentMapper } from '../mappers/DocumentMapper.js';

export class UpdateDocumentUseCase {
  private readonly ownershipService = new DocumentOwnershipService();

  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(dto: UpdateDocumentDto): Promise<DocumentResponseDto> {
    const docId = DocumentId.of(dto.documentId);
    const document = await this.documentRepository.findById(docId);

    if (!document) {
      throw new DocumentNotFoundException(dto.documentId);
    }

    const requestingUserId = OwnerId.of(dto.requestingUserId);
    this.ownershipService.assertCanModify(document, requestingUserId);

    if (dto.title !== undefined) {
      document.updateTitle(DocumentTitle.of(dto.title));
    }

    if (dto.content !== undefined) {
      document.updateContent(dto.content);
    }

    await this.documentRepository.save(document);

    return DocumentMapper.toResponseDto(document);
  }
}
