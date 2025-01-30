import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuth, createUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Cookie')?.split('auth-token=')?.[1]?.split(';')?.[0];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyAuth(token);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is admin
    const adminUser = await db()
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!adminUser.length || adminUser[0].role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Get all users
    const usersList = await db()
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt
      })
      .from(users)
      .orderBy(users.createdAt);

    return NextResponse.json(usersList);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Cookie')?.split('auth-token=')?.[1]?.split(';')?.[0];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyAuth(token);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is admin
    const adminUser = await db()
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!adminUser.length || adminUser[0].role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { email, password, name, role } = await request.json();

    // Validate input
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db()
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await createUser({
      email,
      password,
      name,
      role
    });

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating user' },
      { status: 500 }
    );
  }
}