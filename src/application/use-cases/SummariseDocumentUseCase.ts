/**
 * SummariseDocumentUseCase — fetches a document and requests an AI-generated
 * summary from the external Python document processing service.
 *
 * Notice: the use case depends only on the port interface
 * `IDocumentProcessingService` — it never knows about HTTP or Python.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import { DocumentNotFoundException } from '../../domain/exceptions/DomainException.js';
import type { IDocumentRepository } from '../../domain/repositories/IDocumentRepository.js';
import { DocumentId } from '../../domain/value-objects/DocumentId.js';
import type { IDocumentProcessingService } from '../ports/IDocumentProcessingService.js';

export interface SummariseDocumentInputDto {
  documentId: string;
}

export interface SummariseDocumentOutputDto {
  documentId: string;
  summary: string;
  wordCount: number;
  readingTimeMinutes: number;
}

export class SummariseDocumentUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly processingService: IDocumentProcessingService,
  ) {}

  async execute(dto: SummariseDocumentInputDto): Promise<SummariseDocumentOutputDto> {
    const docId = DocumentId.of(dto.documentId);
    const document = await this.documentRepository.findById(docId);

    if (!document) {
      throw new DocumentNotFoundException(dto.documentId);
    }

    const summary = await this.processingService.summarise(document.content);

    return {
      documentId: document.id.value,
      ...summary,
    };
  }
}
