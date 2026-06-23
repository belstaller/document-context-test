/**
 * PetListingController — thin HTTP adapter for pet listing use cases.
 *
 * Admin panel endpoints for shelter staff to manage pet listings.
 * Pattern:
 *  1. Validate raw input (schema only, not business rules).
 *  2. Build a DTO.
 *  3. Call the appropriate use case.
 *  4. Serialize the DTO output as JSON.
 *
 * LAYER: interfaces — imports only from application/.
 */

import type { NextFunction, Request, Response } from 'express';

import type { ArchivePetListingUseCase } from '../../../application/use-cases/ArchivePetListingUseCase.js';
import type { CreatePetListingUseCase } from '../../../application/use-cases/CreatePetListingUseCase.js';
import type { GetPetListingUseCase } from '../../../application/use-cases/GetPetListingUseCase.js';
import type { ListShelterPetListingsUseCase } from '../../../application/use-cases/ListShelterPetListingsUseCase.js';
import type { UpdatePetListingUseCase } from '../../../application/use-cases/UpdatePetListingUseCase.js';

export class PetListingController {
  constructor(
    private readonly createPetListing: CreatePetListingUseCase,
    private readonly getPetListing: GetPetListingUseCase,
    private readonly updatePetListing: UpdatePetListingUseCase,
    private readonly archivePetListing: ArchivePetListingUseCase,
    private readonly listShelterPetListings: ListShelterPetListingsUseCase,
  ) {}

  // POST /admin/shelters/:shelterId/pet-listings
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { shelterId } = req.params;
      const body = req.body as Record<string, unknown>;

      if (!shelterId) {
        res.status(400).json({ error: 'shelterId path parameter is required.' });
        return;
      }

      const { name, species, breed, ageMonths, vaccinated, neuteredOrSpayed, microchipped, photos } = body;

      if (typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ error: 'Field "name" is required and must be a non-empty string.' });
        return;
      }
      if (typeof species !== 'string' || species.trim().length === 0) {
        res.status(400).json({ error: 'Field "species" is required and must be a non-empty string.' });
        return;
      }
      if (typeof breed !== 'string' || breed.trim().length === 0) {
        res.status(400).json({ error: 'Field "breed" is required and must be a non-empty string.' });
        return;
      }
      if (typeof ageMonths !== 'number') {
        res.status(400).json({ error: 'Field "ageMonths" is required and must be a number.' });
        return;
      }
      if (typeof vaccinated !== 'boolean') {
        res.status(400).json({ error: 'Field "vaccinated" is required and must be a boolean.' });
        return;
      }
      if (typeof neuteredOrSpayed !== 'boolean') {
        res.status(400).json({ error: 'Field "neuteredOrSpayed" is required and must be a boolean.' });
        return;
      }
      if (typeof microchipped !== 'boolean') {
        res.status(400).json({ error: 'Field "microchipped" is required and must be a boolean.' });
        return;
      }

      const photoList: string[] = [];
      if (photos !== undefined) {
        if (!Array.isArray(photos) || !photos.every((p) => typeof p === 'string')) {
          res.status(400).json({ error: 'Field "photos" must be an array of strings.' });
          return;
        }
        photoList.push(...(photos as string[]));
      }

      const result = await this.createPetListing.execute({
        shelterId,
        name,
        species,
        breed,
        ageMonths,
        vaccinated,
        neuteredOrSpayed,
        microchipped,
        photos: photoList,
      });

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET /admin/shelters/:shelterId/pet-listings
  listByShelterId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { shelterId } = req.params;

      if (!shelterId) {
        res.status(400).json({ error: 'shelterId path parameter is required.' });
        return;
      }

      const results = await this.listShelterPetListings.execute({ shelterId });
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  };

  // GET /admin/pet-listings/:id
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Pet listing id is required.' });
        return;
      }

      const result = await this.getPetListing.execute({ listingId: id });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // PATCH /admin/pet-listings/:id
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const shelterId = req.headers['x-shelter-id'];
      const body = req.body as Record<string, unknown>;

      if (!id) {
        res.status(400).json({ error: 'Pet listing id is required.' });
        return;
      }
      if (typeof shelterId !== 'string') {
        res.status(401).json({ error: 'Missing x-shelter-id header.' });
        return;
      }

      const { name, species, breed, ageMonths, vaccinated, neuteredOrSpayed, microchipped, photos } = body;

      if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
        res.status(400).json({ error: 'Field "name" must be a non-empty string.' });
        return;
      }
      if (species !== undefined && (typeof species !== 'string' || species.trim().length === 0)) {
        res.status(400).json({ error: 'Field "species" must be a non-empty string.' });
        return;
      }
      if (breed !== undefined && (typeof breed !== 'string' || breed.trim().length === 0)) {
        res.status(400).json({ error: 'Field "breed" must be a non-empty string.' });
        return;
      }
      if (ageMonths !== undefined && typeof ageMonths !== 'number') {
        res.status(400).json({ error: 'Field "ageMonths" must be a number.' });
        return;
      }
      if (vaccinated !== undefined && typeof vaccinated !== 'boolean') {
        res.status(400).json({ error: 'Field "vaccinated" must be a boolean.' });
        return;
      }
      if (neuteredOrSpayed !== undefined && typeof neuteredOrSpayed !== 'boolean') {
        res.status(400).json({ error: 'Field "neuteredOrSpayed" must be a boolean.' });
        return;
      }
      if (microchipped !== undefined && typeof microchipped !== 'boolean') {
        res.status(400).json({ error: 'Field "microchipped" must be a boolean.' });
        return;
      }
      if (photos !== undefined && (!Array.isArray(photos) || !photos.every((p) => typeof p === 'string'))) {
        res.status(400).json({ error: 'Field "photos" must be an array of strings.' });
        return;
      }

      const result = await this.updatePetListing.execute({
        listingId: id,
        shelterId,
        name: typeof name === 'string' ? name : undefined,
        species: typeof species === 'string' ? species : undefined,
        breed: typeof breed === 'string' ? breed : undefined,
        ageMonths: typeof ageMonths === 'number' ? ageMonths : undefined,
        vaccinated: typeof vaccinated === 'boolean' ? vaccinated : undefined,
        neuteredOrSpayed: typeof neuteredOrSpayed === 'boolean' ? neuteredOrSpayed : undefined,
        microchipped: typeof microchipped === 'boolean' ? microchipped : undefined,
        photos: Array.isArray(photos) ? (photos as string[]) : undefined,
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // POST /admin/pet-listings/:id/archive
  archive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const shelterId = req.headers['x-shelter-id'];

      if (!id) {
        res.status(400).json({ error: 'Pet listing id is required.' });
        return;
      }
      if (typeof shelterId !== 'string') {
        res.status(401).json({ error: 'Missing x-shelter-id header.' });
        return;
      }

      const result = await this.archivePetListing.execute({ listingId: id, shelterId });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
