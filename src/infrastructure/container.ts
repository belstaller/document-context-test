/**
 * Dependency Injection Container — wires up all concrete implementations.
 *
 * This is the only place in the codebase where infrastructure implementations
 * are bound to application port interfaces.
 * Interface controllers import use cases from here.
 *
 * LAYER: infrastructure (composition root)
 */

import { CreateDocumentUseCase } from '../application/use-cases/CreateDocumentUseCase.js';
import { GetDocumentUseCase } from '../application/use-cases/GetDocumentUseCase.js';
import { ListUserDocumentsUseCase } from '../application/use-cases/ListUserDocumentsUseCase.js';
import { PublishDocumentUseCase } from '../application/use-cases/PublishDocumentUseCase.js';
import { RegisterUserUseCase } from '../application/use-cases/RegisterUserUseCase.js';
import { SummariseDocumentUseCase } from '../application/use-cases/SummariseDocumentUseCase.js';
import { UpdateDocumentUseCase } from '../application/use-cases/UpdateDocumentUseCase.js';
import { DatabaseClient } from './database/DatabaseClient.js';
import { DocumentProcessingHttpClient } from './http/DocumentProcessingHttpClient.js';
import { PostgresDocumentRepository } from './repositories/PostgresDocumentRepository.js';
import { PostgresUserRepository } from './repositories/PostgresUserRepository.js';

// ─── Singletons ──────────────────────────────────────────────────────────────

const db = DatabaseClient.getInstance();

const documentRepository = new PostgresDocumentRepository(db);
const userRepository = new PostgresUserRepository(db);
const documentProcessingService = new DocumentProcessingHttpClient();

// ─── Use Case Factories ───────────────────────────────────────────────────────

export const createDocumentUseCase = new CreateDocumentUseCase(documentRepository, userRepository);
export const getDocumentUseCase = new GetDocumentUseCase(documentRepository);
export const updateDocumentUseCase = new UpdateDocumentUseCase(documentRepository);
export const publishDocumentUseCase = new PublishDocumentUseCase(documentRepository);
export const listUserDocumentsUseCase = new ListUserDocumentsUseCase(documentRepository);
export const registerUserUseCase = new RegisterUserUseCase(userRepository);
export const summariseDocumentUseCase = new SummariseDocumentUseCase(
  documentRepository,
  documentProcessingService,
);

export { db };
