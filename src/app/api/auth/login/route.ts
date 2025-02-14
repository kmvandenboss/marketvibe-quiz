import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, createSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt:', { email }); // Log the login attempt

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db()
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    console.log('User found:', user.length > 0); // Log if user was found

    if (!user.length) {
      console.log('No user found with email:', email);
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user[0].hashed_password);
    console.log('Password valid:', isValidPassword); // Log password verification result

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    await db()
      .update(users)
      .set({ last_login: new Date(), updated_at: new Date() })
      .where(eq(users.id, user[0].id));

    // Create session and set cookie
    await createSession(user[0].id);

    console.log('Login successful for:', email); // Log successful login

    return NextResponse.json({
      user: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        role: user[0].role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
