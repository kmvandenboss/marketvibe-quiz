// db/migrations.ts
import { sql } from 'drizzle-orm';
import { db } from './index';

export async function createTables() {
  try {
    console.log('Creating tables...');

    // Create questions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        text TEXT NOT NULL,
        type TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        options JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Questions table created');

    // Create investment_options table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS investment_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        link TEXT NOT NULL,
        tags JSONB NOT NULL,
        priority INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Investment options table created');

    // Create leads table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        name TEXT,
        responses JSONB NOT NULL,
        clicked_links JSONB NOT NULL,
        score JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Leads table created');

    return { success: true };
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('All tables created successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}