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
import { ArchivePetListingUseCase } from '../application/use-cases/ArchivePetListingUseCase.js';
import { CreatePetListingUseCase } from '../application/use-cases/CreatePetListingUseCase.js';
import { GetPetListingUseCase } from '../application/use-cases/GetPetListingUseCase.js';
import { ListPetListingsUseCase } from '../application/use-cases/ListPetListingsUseCase.js';
import { ListShelterPetListingsUseCase } from '../application/use-cases/ListShelterPetListingsUseCase.js';
import { UpdatePetListingUseCase } from '../application/use-cases/UpdatePetListingUseCase.js';
import { DatabaseClient } from './database/DatabaseClient.js';
import { DocumentProcessingHttpClient } from './http/DocumentProcessingHttpClient.js';
import { PostgresDocumentRepository } from './repositories/PostgresDocumentRepository.js';
import { PostgresPetListingRepository } from './repositories/PostgresPetListingRepository.js';
import { PostgresUserRepository } from './repositories/PostgresUserRepository.js';

// ─── Singletons ──────────────────────────────────────────────────────────────

const db = DatabaseClient.getInstance();

const documentRepository = new PostgresDocumentRepository(db);
const userRepository = new PostgresUserRepository(db);
const documentProcessingService = new DocumentProcessingHttpClient();
const petListingRepository = new PostgresPetListingRepository(db);

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

export const createPetListingUseCase = new CreatePetListingUseCase(petListingRepository);
export const getPetListingUseCase = new GetPetListingUseCase(petListingRepository);
export const updatePetListingUseCase = new UpdatePetListingUseCase(petListingRepository);
export const archivePetListingUseCase = new ArchivePetListingUseCase(petListingRepository);
export const listShelterPetListingsUseCase = new ListShelterPetListingsUseCase(petListingRepository);
export const listPetListingsUseCase = new ListPetListingsUseCase(petListingRepository);

export { db };
