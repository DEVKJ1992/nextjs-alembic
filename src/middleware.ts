import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host');
  let changed = false;

  // 1. Handle Domain Migration (getalembic.com -> alembic.com)
  if (host === 'getalembic.com') {
    url.protocol = 'https';
    url.hostname = 'alembic.com';
    url.port = '';
    changed = true;
  }

  // 2. Handle Junk Query Stripping
  if (url.search) {
    const queryContent = url.search.slice(1);

    const hasSlashes = queryContent.includes('/') || /%2f/i.test(queryContent);
    const isJunkToken = !queryContent.includes('=') || queryContent.endsWith('=');
    const isNumericJunk = /^\d+=?$/.test(queryContent);

    if (hasSlashes || isJunkToken || isNumericJunk) {
      url.search = ''; 
      changed = true;
    }
  }

  if (changed) {
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api, _next/static, _next/image, favicon.ico
     * - images, resources (Your static media folders)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|resources).*)',
  ],
};