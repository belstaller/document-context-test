/**
 * DocumentMapper — converts between domain entities and DTOs.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import type { Document } from '../../domain/entities/Document.js';
import type { DocumentResponseDto } from '../dtos/DocumentDto.js';

export class DocumentMapper {
  static toResponseDto(document: Document): DocumentResponseDto {
    return {
      id: document.id.value,
      title: document.title.value,
      content: document.content,
      ownerId: document.ownerId.value,
      status: document.status,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    };
  }

  static toResponseDtoList(documents: Document[]): DocumentResponseDto[] {
    return documents.map(DocumentMapper.toResponseDto);
  }
}
