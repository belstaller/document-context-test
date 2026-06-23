/**
 * ShelterController — thin HTTP adapter for shelter use cases.
 *
 * Public endpoints for shelter profile pages.
 * Pattern:
 *  1. Validate raw input (schema only, not business rules).
 *  2. Build a DTO.
 *  3. Call the appropriate use case.
 *  4. Serialize the DTO output as JSON.
 *
 * LAYER: interfaces — imports only from application/.
 */

import type { NextFunction, Request, Response } from 'express';

import type { GetShelterUseCase } from '../../../application/use-cases/GetShelterUseCase.js';
import type { ListSheltersUseCase } from '../../../application/use-cases/ListSheltersUseCase.js';

export class ShelterController {
  constructor(
    private readonly getShelter: GetShelterUseCase,
    private readonly listShelters: ListSheltersUseCase,
  ) {}

  // GET /api/shelters
  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await this.listShelters.execute();
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/shelters/:id
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Shelter id is required.' });
        return;
      }

      const result = await this.getShelter.execute({ shelterId: id });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
