import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { channels } from '../../../rabbitmq/channels/index.js';

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

      const { channel, queue } = await channels.createOrdersChannel();

      channel.sendToQueue(queue, Buffer.from(JSON.stringify({ amount })));

      reply.status(201).send({ amount });
    },
  );
}
