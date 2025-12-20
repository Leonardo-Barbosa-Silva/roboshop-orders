import 'fastify';
import type { Options } from 'amqplib';

declare module 'fastify' {
  interface FastifyInstance {
    rabbitmq: {
      publish(params: {
        queue: string;
        content: Buffer;
        options?: Options.Publish;
      }): Promise<void>;
      isReady?: () => boolean;
    };
  }
}
