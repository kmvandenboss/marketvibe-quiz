import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './config';

// Run migrations
async function runMigrations() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './db/migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigrations();