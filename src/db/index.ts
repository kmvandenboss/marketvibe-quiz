// /db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

// Configure neon to use WebSocket for better connection handling
neonConfig.fetchConnectionCache = true;

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function db(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon<boolean, boolean>(process.env.DATABASE_URL);
    _db = drizzle(sql, { schema }) as NeonHttpDatabase<typeof schema>;
  }
  return _db;
}

// Create a function to explicitly close the connection if needed
export async function closeConnection(): Promise<void> {
  _db = null;
}

// Export the database type for use in other files
export type Database = NeonHttpDatabase<typeof schema>;
