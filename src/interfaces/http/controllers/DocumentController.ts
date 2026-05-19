/**
 * DocumentController — thin HTTP adapter for document use cases.
 *
 * Pattern:
 *  1. Validate raw input (schema only, not business rules).
 *  2. Build a DTO.
 *  3. Call the appropriate use case.
 *  4. Serialize the DTO output as JSON.
 *
 * LAYER: interfaces — imports only from application/.
 */

import type { NextFunction, Request, Response } from 'express';

import type { CreateDocumentUseCase } from '../../../application/use-cases/CreateDocumentUseCase.js';
import type { GetDocumentUseCase } from '../../../application/use-cases/GetDocumentUseCase.js';
import type { ListUserDocumentsUseCase } from '../../../application/use-cases/ListUserDocumentsUseCase.js';
import type { PublishDocumentUseCase } from '../../../application/use-cases/PublishDocumentUseCase.js';
import type { SummariseDocumentUseCase } from '../../../application/use-cases/SummariseDocumentUseCase.js';
import type { UpdateDocumentUseCase } from '../../../application/use-cases/UpdateDocumentUseCase.js';

export class DocumentController {
  constructor(
    private readonly createDocument: CreateDocumentUseCase,
    private readonly getDocument: GetDocumentUseCase,
    private readonly updateDocument: UpdateDocumentUseCase,
    private readonly publishDocument: PublishDocumentUseCase,
    private readonly listUserDocuments: ListUserDocumentsUseCase,
    private readonly summariseDocument: SummariseDocumentUseCase,
  ) {}

  // POST /documents
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, content } = req.body as { title?: unknown; content?: unknown };
      const requestingUserId = req.headers['x-user-id'];

      if (typeof title !== 'string' || typeof content !== 'string') {
        res.status(400).json({ error: 'Fields "title" and "content" are required strings.' });
        return;
      }
      if (typeof requestingUserId !== 'string') {
        res.status(401).json({ error: 'Missing x-user-id header.' });
        return;
      }

      const result = await this.createDocument.execute({ title, content, requestingUserId });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET /documents/:id
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const requestingUserId = req.headers['x-user-id'];

      if (!id) {
        res.status(400).json({ error: 'Document id is required.' });
        return;
      }
      if (typeof requestingUserId !== 'string') {
        res.status(401).json({ error: 'Missing x-user-id header.' });
        return;
      }

      const result = await this.getDocument.execute({
        documentId: id,
        requestingUserId,
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // PATCH /documents/:id
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, content } = req.body as { title?: unknown; content?: unknown };
      const requestingUserId = req.headers['x-user-id'];

      if (!id) {
        res.status(400).json({ error: 'Document id is required.' });
        return;
      }
      if (typeof requestingUserId !== 'string') {
        res.status(401).json({ error: 'Missing x-user-id header.' });
        return;
      }

      const result = await this.updateDocument.execute({
        documentId: id,
        title: typeof title === 'string' ? title : undefined,
        content: typeof content === 'string' ? content : undefined,
        requestingUserId,
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // POST /documents/:id/publish
  publish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const requestingUserId = req.headers['x-user-id'];

      if (!id) {
        res.status(400).json({ error: 'Document id is required.' });
        return;
      }
      if (typeof requestingUserId !== 'string') {
        res.status(401).json({ error: 'Missing x-user-id header.' });
        return;
      }

      const result = await this.publishDocument.execute({ documentId: id, requestingUserId });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET /users/:userId/documents
  listByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({ error: 'User id is required.' });
        return;
      }

      const results = await this.listUserDocuments.execute({ ownerId: userId });
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  };

  // GET /documents/:id/summary
  summarise = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Document id is required.' });
        return;
      }

      const result = await this.summariseDocument.execute({ documentId: id });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
