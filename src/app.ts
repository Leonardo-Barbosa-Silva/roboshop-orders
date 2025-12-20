import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { env } from './env.js';
import { appRoutes } from './routes/index.js';
import { rabbitmqPlugin } from './plugins/rabbitmq/main.js';
import { postgresPlugin } from './plugins/postgres/main.js';

export function buildApp() {
  const app = fastify({
    logger: { name: 'roboshop-orders-api' },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.get('/health', (_, reply) => {
    reply.status(200).send({ status: 'ok' });
  });

  app.register(rabbitmqPlugin, {
    url: env.RABBITMQ_URL,
    queues: ['orders'],
  });

  app.register(postgresPlugin, {
    connectionString: env.POSTGRES_DATABASE_URL,
  });

  app.register(appRoutes);

  return app;
}
