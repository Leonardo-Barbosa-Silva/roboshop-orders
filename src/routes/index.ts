import type { FastifyInstance } from 'fastify';
import { ordersRoutes } from './orders/index.js';

export async function appRoutes(fastify: FastifyInstance) {
  fastify.register(ordersRoutes, { prefix: '/orders' });
}
