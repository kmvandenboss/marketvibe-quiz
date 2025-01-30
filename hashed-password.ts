import bcrypt from 'bcryptjs';
import { db } from './src/db';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function updateAdminPassword() {
  const password = 'admin123'; // This will be the new password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    await db().update(users)
      .set({ hashedPassword: hashedPassword })
      .where(eq(users.email, 'admin@example.com'));
    
    console.log('Password updated successfully');
  } catch (error) {
    console.error('Error updating password:', error);
  }
}

updateAdminPassword();