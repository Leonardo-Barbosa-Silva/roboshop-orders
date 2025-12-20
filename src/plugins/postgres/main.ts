import { drizzle } from 'drizzle-orm/node-postgres';
import fastifyPlugin from 'fastify-plugin';
import { Pool } from 'pg';

interface PostgresOptions {
  connectionString: string;
}

export const postgresPlugin = fastifyPlugin<PostgresOptions>(
  async (fastify, options) => {
    const pool = new Pool({
      connectionString: options.connectionString,
      max: 10,
    });

    await pool.query('SELECT 1');

    const postgresClient = drizzle(pool);

    fastify.decorate('postgres', {
      client: postgresClient,
    });

    fastify.addHook('onClose', async () => {
      fastify.log.info(
        { service: 'postgres' },
        'Closing PostgreSQL connection pool...',
      );

      await pool.end();
    });
  },
  {
    name: 'postgres-plugin',
  },
);
