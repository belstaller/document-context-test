/**
 * ListUserDocumentsUseCase — retrieves all documents belonging to a user.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import type { IDocumentRepository } from '../../domain/repositories/IDocumentRepository.js';
import { OwnerId } from '../../domain/value-objects/OwnerId.js';
import type { DocumentResponseDto, ListUserDocumentsDto } from '../dtos/DocumentDto.js';
import { DocumentMapper } from '../mappers/DocumentMapper.js';

export class ListUserDocumentsUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(dto: ListUserDocumentsDto): Promise<DocumentResponseDto[]> {
    const ownerId = OwnerId.of(dto.ownerId);
    const documents = await this.documentRepository.findByOwnerId(ownerId);
    return DocumentMapper.toResponseDtoList(documents);
  }
}
