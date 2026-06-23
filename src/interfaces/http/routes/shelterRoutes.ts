/**
 * shelterRoutes — registers all public shelter HTTP routes.
 *
 * Routes are mounted under /api/shelters by the server:
 *   GET  /api/shelters       — list all shelters
 *   GET  /api/shelters/:id   — get a single shelter by id
 *
 * LAYER: interfaces
 */

import { Router } from 'express';

import type { ShelterController } from '../controllers/ShelterController.js';

export function createShelterRouter(controller: ShelterController): Router {
  const router = Router();

  router.get('/', controller.list);
  router.get('/:id', controller.getById);

  return router;
}
