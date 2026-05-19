/**
 * server.ts — composes the Express application.
 *
 * Wires together middleware, routes and the DI container.
 * Keep this file free of business logic.
 *
 * LAYER: interfaces (application entry point)
 */

import express from 'express';

import {
  createDocumentUseCase,
  getDocumentUseCase,
  listUserDocumentsUseCase,
  publishDocumentUseCase,
  registerUserUseCase,
  summariseDocumentUseCase,
  updateDocumentUseCase,
} from '../../infrastructure/container.js';
import { DocumentController } from './controllers/DocumentController.js';
import { UserController } from './controllers/UserController.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { createDocumentRouter } from './routes/documentRoutes.js';
import { createUserRouter } from './routes/userRoutes.js';

export function createApp(): express.Application {
  const app = express();

  // ─── Middleware ────────────────────────────────────────────────────────────
  app.use(express.json());
  app.use(requestLogger);

  // ─── Controllers ──────────────────────────────────────────────────────────
  const documentController = new DocumentController(
    createDocumentUseCase,
    getDocumentUseCase,
    updateDocumentUseCase,
    publishDocumentUseCase,
    listUserDocumentsUseCase,
    summariseDocumentUseCase,
  );
  const userController = new UserController(registerUserUseCase);

  // ─── Routes ───────────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() });
  });

  app.use('/api/documents', createDocumentRouter(documentController));
  app.use('/api/users', createUserRouter(userController, documentController));

  // ─── Error Handler (must be last) ─────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
