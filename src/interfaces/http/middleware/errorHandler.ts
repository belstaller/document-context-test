/**
 * errorHandler — Express global error-handling middleware.
 *
 * Maps domain/application exceptions to appropriate HTTP status codes.
 * Business logic NEVER lives here — only status-code decisions.
 *
 * LAYER: interfaces
 */

import type { ErrorRequestHandler } from 'express';

import {
  DomainException,
  DocumentNotFoundException,
  UnauthorisedAccessException,
  UserNotFoundException,
} from '../../../domain/exceptions/DomainException.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof DocumentNotFoundException || err instanceof UserNotFoundException) {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err instanceof UnauthorisedAccessException) {
    res.status(403).json({ error: err.message });
    return;
  }

  if (err instanceof DomainException) {
    res.status(422).json({ error: err.message });
    return;
  }

  if (err instanceof Error) {
    // Unexpected error — log and return a generic 500.
    console.error('[errorHandler]', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
    return;
  }

  res.status(500).json({ error: 'Unknown error.' });
};
