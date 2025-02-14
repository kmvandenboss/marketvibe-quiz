// src/lib/auth.ts
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret);

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 8);

  await db().insert(sessions).values({
    user_id: userId,
    token,
    expires_at: expiresAt
  });

  const cookieStore = cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt
  });

  return token;
}

export async function verifyAuth(token: string) {
  try {
    const verified = await jwtVerify(token, secret);
    const session = await db()
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);

    if (!session.length) return false;
    if (new Date() > new Date(session[0].expires_at)) return false;

    return verified.payload.userId as string;
  } catch {
    return false;
  }
}

export async function getUserById(id: string) {
  const user = await db()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user[0] || null;
}

export async function createUser({
  email,
  password,
  name,
  role = 'user'
}: {
  email: string;
  password: string;
  name: string;
  role?: string;
}) {
  const hashedPassword = await hashPassword(password);
  
  const [user] = await db()
    .insert(users)
    .values({
      email,
      hashed_password: hashedPassword,
      name,
      role
    })
    .returning();

  return user;
}
