import type { FastifyInstance } from 'fastify';
import { createOrderController } from '../../controllers/orders/create/main.js';

export async function ordersRoutes(fastify: FastifyInstance) {
  fastify.register(createOrderController);
}
