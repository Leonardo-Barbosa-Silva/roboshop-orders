import amqplib from 'amqplib';

import { env } from '../env.js';

export const createRabbitMQConnection = async () => {
  const connection = await amqplib.connect(env.RABBITMQ_URL);
  return connection;
};
