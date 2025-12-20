import * as amqplib from 'amqplib';
import type { Connection, Options, ConfirmChannel } from 'amqplib';
import fastifyPlugin from 'fastify-plugin';

interface RabbitMQState {
  connection: Connection | null;
  channel: ConfirmChannel | null;
  isReady: boolean;
}

interface RabbitMQOptions {
  url: string;
  queues: string[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const rabbitmqPlugin = fastifyPlugin<RabbitMQOptions>(
  async (fastify, options) => {
    const state: RabbitMQState = {
      connection: null,
      channel: null,
      isReady: false,
    };

    async function createRabbitMQConnection(): Promise<void> {
      const { url, queues } = options;

      for (let attempt = 1; attempt <= 5; attempt++) {
        let connection: Connection | null = null;
        let channel: ConfirmChannel | null = null;

        try {
          connection = await amqplib.connect(url);
          channel = await connection.createConfirmChannel();

          for (const queue of queues) {
            await channel.assertQueue(queue, { durable: true });
          }

          connection.on('close', () => {
            state.connection = null;
            state.channel = null;
            state.isReady = false;
            fastify.log.warn({ service: 'rabbitmq' }, 'Connection closed');
          });

          connection.on('error', (error) => {
            state.connection = null;
            state.channel = null;
            state.isReady = false;

            fastify.log.error(
              { service: 'rabbitmq', error },
              'Connection error',
            );
          });

          state.connection = connection;
          state.channel = channel;
          state.isReady = true;

          fastify.log.info({ service: 'rabbitmq' }, 'Connection established');

          return;
        } catch (error) {
          fastify.log.error(
            { service: 'rabbitmq', error },
            'Connection failed',
          );

          await channel?.close();
          await connection?.close();

          await sleep(500 * attempt);
        }
      }

      throw new Error('Failed to connect to RabbitMQ');
    }

    await createRabbitMQConnection();

    fastify.addHook('onClose', async () => {
      await state.channel?.close();
      await state.connection?.close();

      state.channel = null;
      state.connection = null;
      state.isReady = false;

      fastify.log.info({ service: 'rabbitmq' }, 'Closed');
    });

    fastify.decorate('rabbitmq', {
      publish: async ({
        queue,
        content,
        options,
      }: {
        queue: string;
        content: Buffer;
        options?: Options.Publish;
      }) => {
        if (!state.isReady || !state.channel || !state.connection) {
          throw new Error('RabbitMQ is not ready');
        }

        const { channel } = state;

        const result = channel.sendToQueue(queue, content, options);

        if (!result) {
          await new Promise<void>((resolve) => channel.once('drain', resolve));
        }

        await channel.waitForConfirms();
      },
    });
  },
  {
    name: 'rabbitmq-plugin',
  },
);
