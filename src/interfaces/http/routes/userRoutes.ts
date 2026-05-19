/**
 * userRoutes — registers all user-related HTTP routes.
 *
 * LAYER: interfaces
 */

import { Router } from 'express';

import type { UserController } from '../controllers/UserController.js';
import type { DocumentController } from '../controllers/DocumentController.js';

export function createUserRouter(
  userController: UserController,
  documentController: DocumentController,
): Router {
  const router = Router();

  router.post('/', userController.register);
  router.get('/:userId/documents', documentController.listByUser);

  return router;
}
