import env from './env.js';
import { defineConfig } from 'drizzle-kit';

console.log(env.database_url)
export default defineConfig({
  out: '../drizzle',
  schema: '../model/user.model.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.database_url,
  },
});
