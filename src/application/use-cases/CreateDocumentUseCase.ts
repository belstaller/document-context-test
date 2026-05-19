/**
 * CreateDocumentUseCase — creates a new draft document for a user.
 *
 * Pattern:
 *  - Single class with an `execute(dto)` method.
 *  - Dependencies injected via constructor (no service locator).
 *  - Returns a DTO, never a raw domain entity.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

import { Document } from '../../domain/entities/Document.js';
import {
  DocumentNotFoundException,
  UserNotFoundException,
} from '../../domain/exceptions/DomainException.js';
import type { IDocumentRepository } from '../../domain/repositories/IDocumentRepository.js';
import type { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { DocumentId } from '../../domain/value-objects/DocumentId.js';
import { DocumentTitle } from '../../domain/value-objects/DocumentTitle.js';
import { OwnerId } from '../../domain/value-objects/OwnerId.js';
import type { CreateDocumentDto, DocumentResponseDto } from '../dtos/DocumentDto.js';
import { DocumentMapper } from '../mappers/DocumentMapper.js';

export class CreateDocumentUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateDocumentDto): Promise<DocumentResponseDto> {
    // 1. Validate the requesting user exists.
    const ownerId = OwnerId.of(dto.requestingUserId);
    const userExists = await this.userRepository.exists(ownerId);
    if (!userExists) {
      throw new UserNotFoundException(dto.requestingUserId);
    }

    // 2. Construct value objects — domain invariants are enforced here.
    const title = DocumentTitle.of(dto.title);

    // 3. Create the aggregate root.
    const document = Document.create({
      id: DocumentId.generate(),
      title,
      content: dto.content,
      ownerId,
    });

    // 4. Persist.
    await this.documentRepository.save(document);

    // 5. Return a DTO — never the entity itself.
    return DocumentMapper.toResponseDto(document);
  }
}
