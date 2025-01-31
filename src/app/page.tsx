// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/high-yield-quiz');
  return null; // won't render because redirect happens first
}

