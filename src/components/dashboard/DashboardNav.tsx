// /src/components/dashboard/DashboardNav.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import type { Quiz } from '@/types/dashboard';

export function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch('/api/quizzes');
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    }
    fetchQuizzes();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    ...quizzes.map(quiz => ({
      href: `/dashboard/${quiz.id}`,
      label: quiz.title
    })),
    { href: '/dashboard/users', label: 'Users' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${
                  pathname === item.href
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
