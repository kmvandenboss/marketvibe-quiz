import { migrate } from 'drizzle-orm/neon-http/migrator';
import { sql } from 'drizzle-orm';
import { db } from './config';
import path from 'path';

async function runMigrations() {
  try {
    const migrationsFolder = path.join(process.cwd(), 'src', 'db', 'migrations');
    console.log('Running migrations...');
    
    // First try direct column addition
    console.log('Attempting direct column addition...');
    await db.execute(sql`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT FROM information_schema.columns 
              WHERE table_name = 'leads' AND column_name = 'is_accredited'
          ) THEN
              ALTER TABLE "leads" ADD COLUMN "is_accredited" boolean NOT NULL DEFAULT false;
              RAISE NOTICE 'Column added successfully';
          ELSE
              RAISE NOTICE 'Column already exists';
          END IF;
      END $$;
    `);

    // Then run regular migrations
    await migrate(db, { migrationsFolder });
    console.log('Migrations completed successfully');
    
    // Verify table structure
    const result = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'leads'
      ORDER BY ordinal_position;
    `);
    console.log('Current table structure:', result.rows);

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigrations();