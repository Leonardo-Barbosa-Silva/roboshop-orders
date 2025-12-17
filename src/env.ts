import { z } from 'zod';

const envSchema = z.object({
  SERVER_PORT: z.coerce.number(),
  POSTGRES_DATABASE_URL: z.string(),
  RABBITMQ_URL: z.string(),
});

export const env = envSchema.parse(process.env);
