// db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { config } from './config';

console.log('Attempting to connect to database...');

const sql = neon(config.databaseUrl);
export const db = drizzle(sql, { schema });

// Helper function to check database connection
export async function checkDatabaseConnection(): Promise<{ ok: boolean; timestamp?: Date; error?: any }> {
  try {
    console.log('Testing database connection...');
    const result = await sql`SELECT NOW()`;
    console.log('Database connection successful');
    return { ok: true, timestamp: result[0].now };
  } catch (error) {
    console.error('Database connection error:', error);
    return { ok: false, error };
  }
}

// Test connection immediately if this file is being run directly
if (require.main === module) {
  checkDatabaseConnection()
    .then(result => console.log('Connection test result:', result))
    .catch(error => console.error('Connection test failed:', error));
}