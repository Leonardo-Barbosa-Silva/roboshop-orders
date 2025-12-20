import 'fastify';
import { Pool } from 'pg';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

type PostgresClient = NodePgDatabase<Record<string, never>> & {
  $client: Pool;
};

declare module 'fastify' {
  interface FastifyInstance {
    postgres: {
      client: PostgresClient;
    };
  }
}
