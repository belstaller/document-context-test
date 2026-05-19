/**
 * UserController — thin HTTP adapter for user use cases.
 *
 * LAYER: interfaces — imports only from application/.
 */

import type { NextFunction, Request, Response } from 'express';

import type { RegisterUserUseCase } from '../../../application/use-cases/RegisterUserUseCase.js';

export class UserController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  // POST /users
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, displayName } = req.body as {
        email?: unknown;
        displayName?: unknown;
      };

      if (typeof email !== 'string' || typeof displayName !== 'string') {
        res.status(400).json({ error: 'Fields "email" and "displayName" are required strings.' });
        return;
      }

      const result = await this.registerUser.execute({ email, displayName });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}
