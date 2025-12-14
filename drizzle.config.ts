import { defineConfig } from 'drizzle-kit';

import { env } from './src/env.js';

export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/db/schemas/*',
  out: 'drizzle/migrations',
  casing: 'snake_case',
  dbCredentials: {
    url: `
        postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}
    `,
  },
});
