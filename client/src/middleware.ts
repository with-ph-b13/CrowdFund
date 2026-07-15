import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Vercel's vercel.json rewrite `/(.*) -> /client/$1` causes Next.js to receive `/client/...` 
  // which breaks Next.js App Router dynamic routes (like /campaigns/[id]).
  // We rewrite it internally back to the intended path before Next.js router resolves it.
  if (url.pathname.startsWith('/client/')) {
    url.pathname = url.pathname.replace(/^\/client/, '');
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/client/:path*',
};
