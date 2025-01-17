// src/app/api/questions/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    console.log('Starting questions fetch...');
    
    // Create database connection
    const sql = neon(process.env.DATABASE_URL!);
    
    // Fetch questions using raw SQL
    const result = await sql`
      SELECT * FROM questions 
      ORDER BY "order" ASC
    `;
    
    console.log('Query completed, found rows:', result.length);
    
    return NextResponse.json({
      success: true,
      questions: result,
    });
    
  } catch (error) {
    console.error('API Error:', error);
    const err = error as Error;
    
    return NextResponse.json(
      { 
        success: false, 
        error: err.message,
        details: {
          name: err.name,
          stack: err.stack,
        }
      },
      { status: 500 }
    );
  }
}
