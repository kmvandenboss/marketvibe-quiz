// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'

// Add paths that require authentication
const protectedPaths = ['/dashboard']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if path requires authentication
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const verified = await verifyAuth(token)
      if (!verified) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}