import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function createOrderController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      schema: {
        body: z.object({
          amount: z.number(),
        }),
      },
    },
    async (request, reply) => {
      const { amount } = request.body;

      fastify.rabbitmq.publish({
        queue: 'orders',
        content: Buffer.from(JSON.stringify({ amount })),
      });

      reply.status(201).send({ amount });
    },
  );
}
