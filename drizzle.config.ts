// For TS to know about the node environment
/// <reference types="node" />

import { defineConfig } from 'drizzle-kit';

if (!process.env.POSTGRES_DATABASE_URL) {
  throw new Error('POSTGRES_DATABASE_URL env must exists.');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/db/schemas/drizzle.ts',
  out: 'drizzle/migrations',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.POSTGRES_DATABASE_URL,
  },
});
