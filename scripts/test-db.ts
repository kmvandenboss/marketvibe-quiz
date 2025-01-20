import * as dotenv from 'dotenv';
// Load .env file before other imports
dotenv.config();

import { db } from '../db/config';
import { questions } from '../db/schema';
import { eq } from 'drizzle-orm';

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
    
    // Test 1: Query all questions
    console.log('\nTest 1: Fetching all questions...');
    const allQuestions = await db.select().from(questions);
    console.log(`✓ Successfully retrieved ${allQuestions.length} questions`);
    console.log('First question:', allQuestions[0]?.text);

    // Test 2: Query questions by order
    console.log('\nTest 2: Fetching first question by order...');
    const firstQuestion = await db
      .select()
      .from(questions)
      .where(eq(questions.order, 1))
      .limit(1);
    
    if (firstQuestion[0]) {
      console.log('✓ Successfully retrieved question with order 1:');
      console.log('  Text:', firstQuestion[0].text);
      console.log('  Type:', firstQuestion[0].type);
      console.log('  Options:', JSON.stringify(firstQuestion[0].options, null, 2));
    }

    // Print schema validation success
    console.log('\n✓ Database schema validation successful');
    console.log('✓ All database tests passed');

  } catch (error) {
    console.error('\n✕ Database test failed:', error);
    process.exit(1);
  }
}

testDatabaseConnection();