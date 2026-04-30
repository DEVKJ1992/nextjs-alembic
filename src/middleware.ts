import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();
	const { pathname, search } = url;
	const host = request.headers.get("host");
	let changed = false;

	// --- 1. FAST PATH EXIT ---
	// If this is a static file or internal Next.js request, skip middleware entirely.
	// This prevents MIME type errors (nosniff) caused by accidental redirects.
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.includes(".") ||
		pathname === "/favicon.ico"
	) {
		return NextResponse.next();
	}

	// --- 2. Handle Domain Migration (getalembic.com -> alembic.com) ---
	if (host === "getalembic.com") {
		url.protocol = "https";
		url.hostname = "alembic.com";
		url.port = "";
		changed = true;
	}

	// --- 3. Handle Junk Query Stripping ---
	if (search) {
		const queryContent = search.slice(1);

		const hasSlashes =
			queryContent.includes("/") || /%2f/i.test(queryContent);
		const isJunkToken =
			!queryContent.includes("=") || queryContent.endsWith("=");
		const isNumericJunk = /^\d+=?$/.test(queryContent);

		// Only strip if it's junk, but double-check we aren't on a path that needs it
		if (hasSlashes || isJunkToken || isNumericJunk) {
			url.search = "";
			changed = true;
		}
	}

	if (changed) {
		return NextResponse.redirect(url, 301);
	}

	return NextResponse.next();
}

// --- 4. OPTIMIZED MATCHER ---
export const config = {
	matcher: [
		/*
		 * Match all request paths except for:
		 * 1. api (API routes)
		 * 2. _next/static (static files)
		 * 3. _next/image (image optimization files)
		 * 4. favicon.ico (favicon file)
		 * 5. Static files with extensions (svg, jpg, js, css, etc.)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|woff|woff2|ttf|eot|otf|xml|txt)$).*)",
	],
};
