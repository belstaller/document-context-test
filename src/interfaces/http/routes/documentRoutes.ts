/**
 * documentRoutes — registers all document-related HTTP routes.
 *
 * LAYER: interfaces
 */

import { Router } from 'express';

import type { DocumentController } from '../controllers/DocumentController.js';

export function createDocumentRouter(controller: DocumentController): Router {
  const router = Router();

  router.post('/', controller.create);
  router.get('/:id', controller.getById);
  router.patch('/:id', controller.update);
  router.post('/:id/publish', controller.publish);
  router.get('/:id/summary', controller.summarise);

  return router;
}
