import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { env } from './env.js';
import { appRoutes } from './routes/index.js';
import { rabbitmqPlugin } from './plugins/rabbitmq/main.js';

function buildApp() {
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

  app.register(appRoutes);

  return app;
}

async function bootstrap() {
  const app = buildApp();

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, 'Shutting down...');

    try {
      await app.close();
      app.log.info('Shutdown complete');
      process.exit(0);
    } catch (error) {
      app.log.error({ error }, 'Shutting down failed');
      process.exit(1);
    }
  };

  // Shutdown when O.S sends SIGTERM (ex: docker stop)
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  // Shutdown when O.S sends SIGINT (user presses Ctrl+C)
  process.on('SIGINT', () => void shutdown('SIGINT'));

  try {
    const address = await app.listen({
      host: '0.0.0.0',
      port: env.SERVER_PORT,
    });
    app.log.info(`Server is running on ${address}`);
  } catch (err) {
    app.log.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

bootstrap();
