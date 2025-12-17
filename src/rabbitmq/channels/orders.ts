import { createRabbitMQConnection } from '../client.js';

export const createOrdersChannel = async () => {
  const connection = await createRabbitMQConnection();

  const channel = await connection.createChannel();

  await channel.assertQueue('orders', { durable: true });

  return {
    channel,
    queue: 'orders',
  };
};
