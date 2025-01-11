// db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    return { ok: true, timestamp: result[0].now };
  } catch (error) {
    console.error('Database connection error:', error);
    return { ok: false, error };
  }
}