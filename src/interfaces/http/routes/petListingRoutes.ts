/**
 * petListingRoutes — registers all pet listing HTTP routes.
 *
 * Public routes (mounted under /api by the server):
 *   GET    /api/pets                                          — browse active listings
 *
 * Admin routes (mounted under /api/admin by the server):
 *   POST   /api/admin/shelters/:shelterId/pet-listings        — create listing
 *   GET    /api/admin/shelters/:shelterId/pet-listings        — list by shelter
 *   GET    /api/admin/pet-listings/:id                        — get single listing
 *   PATCH  /api/admin/pet-listings/:id                        — edit listing
 *   POST   /api/admin/pet-listings/:id/archive                — archive listing
 *
 * LAYER: interfaces
 */

import { Router } from 'express';

import type { PetListingController } from '../controllers/PetListingController.js';

export function createPublicPetListingRouter(controller: PetListingController): Router {
  const router = Router();
  router.get('/', controller.list);
  return router;
}

export function createPetListingRouter(controller: PetListingController): Router {
  const router = Router();

  // Shelter-scoped routes
  router.post('/shelters/:shelterId/pet-listings', controller.create);
  router.get('/shelters/:shelterId/pet-listings', controller.listByShelterId);

  // Listing-scoped routes
  router.get('/pet-listings/:id', controller.getById);
  router.patch('/pet-listings/:id', controller.update);
  router.post('/pet-listings/:id/archive', controller.archive);

  return router;
}
