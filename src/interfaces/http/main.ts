/**
 * main.ts — API gateway entry point.
 *
 * Starts the Express server and runs database migrations.
 *
 * LAYER: interfaces
 */

import { MigrationRunner } from '../../infrastructure/database/MigrationRunner.js';
import { db } from '../../infrastructure/container.js';
import { createApp } from './server.js';

const PORT = parseInt(process.env['PORT'] ?? '4000', 10);

async function bootstrap(): Promise<void> {
  // Run any pending DB migrations before accepting traffic.
  const migrationRunner = new MigrationRunner(db);
  await migrationRunner.run();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`[api-gateway] Listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('[api-gateway] Fatal startup error:', err);
  process.exit(1);
});
