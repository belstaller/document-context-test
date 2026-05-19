/**
 * Unit tests for CreateDocumentUseCase.
 *
 * Dependencies are mocked — no database or HTTP calls.
 */

import { CreateDocumentUseCase } from '../CreateDocumentUseCase.js';
import type { IDocumentRepository } from '../../../domain/repositories/IDocumentRepository.js';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { OwnerId } from '../../../domain/value-objects/OwnerId.js';

// ─── Mock repositories ────────────────────────────────────────────────────────

const mockDocumentRepository: jest.Mocked<IDocumentRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByOwnerId: jest.fn(),
  delete: jest.fn(),
  exists: jest.fn(),
};

const mockUserRepository: jest.Mocked<IUserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  exists: jest.fn(),
};

const VALID_USER_ID = OwnerId.generate().value;

describe('CreateDocumentUseCase', () => {
  let useCase: CreateDocumentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateDocumentUseCase(mockDocumentRepository, mockUserRepository);
    mockUserRepository.exists.mockResolvedValue(true);
    mockDocumentRepository.save.mockResolvedValue(undefined);
  });

  it('creates a document and returns a response DTO', async () => {
    const result = await useCase.execute({
      title: 'My First Document',
      content: 'Hello, world!',
      requestingUserId: VALID_USER_ID,
    });

    expect(result.title).toBe('My First Document');
    expect(result.content).toBe('Hello, world!');
    expect(result.status).toBe('draft');
    expect(result.ownerId).toBe(VALID_USER_ID);
    expect(result.id).toBeDefined();
  });

  it('persists the document exactly once', async () => {
    await useCase.execute({
      title: 'Persisted Doc',
      content: 'Content.',
      requestingUserId: VALID_USER_ID,
    });

    expect(mockDocumentRepository.save).toHaveBeenCalledTimes(1);
  });

  it('throws when the user does not exist', async () => {
    mockUserRepository.exists.mockResolvedValue(false);

    await expect(
      useCase.execute({
        title: 'Doc',
        content: 'Content.',
        requestingUserId: VALID_USER_ID,
      }),
    ).rejects.toThrow();
  });

  it('throws for an empty title', async () => {
    await expect(
      useCase.execute({
        title: '',
        content: 'Content.',
        requestingUserId: VALID_USER_ID,
      }),
    ).rejects.toThrow();
  });
});
