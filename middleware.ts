// middleware.ts or middleware.js (depending on your setup)
import { NextResponse } from 'next/server';

export function middleware() {
  // Allow all routes without restriction
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/(.*)'], // Apply to all routes
};
