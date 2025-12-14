import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';

import { env } from '../env.js';

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/health', (_, reply) => {
  reply.status(200).send({ status: 'ok' });
});

app.post(
  '/orders',
  {
    schema: {
      body: z.object({
        total_amount: z.number(),
        items: z.array(
          z.object({
            product_id: z.string(),
            quantity: z.number(),
            price: z.number(),
          }),
        ),
      }),
    },
  },
  (request, reply) => {
    const { total_amount, items } = request.body;

    reply.status(201).send({ total_amount, items });
  },
);

app
  .listen({ host: '0.0.0.0', port: env.PORT })
  .then((address) => {
    app.log.info(`[Orders] Server is running on ${address}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
