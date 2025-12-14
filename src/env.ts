import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_HOST: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
});

export const env = envSchema.parse(process.env);
