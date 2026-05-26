import { neon, neonConfig } from '@neondatabase/serverless';

// Explicitly disable Next.js fetch caching for all Neon queries
neonConfig.fetchOptions = {
  cache: 'no-store',
  next: { revalidate: 0 }
};

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const sql = neon(process.env.DATABASE_URL);
