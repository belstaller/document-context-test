/**
 * PublishDocumentUseCase — transitions a document from draft to published.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import { DocumentNotFoundException } from '../../domain/exceptions/DomainException.js';
import type { IDocumentRepository } from '../../domain/repositories/IDocumentRepository.js';
import { DocumentOwnershipService } from '../../domain/services/DocumentOwnershipService.js';
import { DocumentId } from '../../domain/value-objects/DocumentId.js';
import { OwnerId } from '../../domain/value-objects/OwnerId.js';
import type { DocumentResponseDto, PublishDocumentDto } from '../dtos/DocumentDto.js';
import { DocumentMapper } from '../mappers/DocumentMapper.js';

export class PublishDocumentUseCase {
  private readonly ownershipService = new DocumentOwnershipService();

  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(dto: PublishDocumentDto): Promise<DocumentResponseDto> {
    const docId = DocumentId.of(dto.documentId);
    const document = await this.documentRepository.findById(docId);

    if (!document) {
      throw new DocumentNotFoundException(dto.documentId);
    }

    const requestingUserId = OwnerId.of(dto.requestingUserId);
    this.ownershipService.assertCanModify(document, requestingUserId);

    document.publish();

    await this.documentRepository.save(document);

    return DocumentMapper.toResponseDto(document);
  }
}
