// src/app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const secret = request.nextUrl.searchParams.get("secret");
	const path = request.nextUrl.searchParams.get("path");

	// Check for a secret token to prevent unauthorized calls
	// Example: https://alembic.com/api/revalidate?secret=customRevalidateSecret&path=/soc-3
	if (secret !== "customRevalidateSecret") {
		return NextResponse.json({ message: "Invalid token" }, { status: 401 });
	}

	if (!path) {
		return NextResponse.json(
			{ message: "Path is required" },
			{ status: 400 },
		);
	}

	try {
		revalidatePath(path);
		return NextResponse.json({ revalidated: true, now: Date.now() });
	} catch (err) {
		return NextResponse.json(
			{ message: "Error revalidating: " + err },
			{ status: 500 },
		);
	}
}
