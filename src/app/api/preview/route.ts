import { NextRequest, NextResponse } from "next/server";

// This is a custom implementation of preview mode for Next.js App Router
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const secret = searchParams.get("secret");
	const type = searchParams.get("type");
	const id = searchParams.get("id");
	const slug = searchParams.get("slug");

	// Check the secret and bail if it doesn't match
	if (secret !== process.env.SANITY_STUDIO_PREVIEW_SECRET) {
		return new Response("Invalid token", { status: 401 });
	}

	// Build the redirect URL based on document type
	let redirectUrl = "/";

	console.log("type", type);
	if (type) {
		// Map document types to their respective URLs
		switch (type) {
			case "post":
				redirectUrl = slug ? `/${slug}` : "/";
				break;
			case "whitepaper":
				redirectUrl = slug ? `/whitepapers/${slug}` : "/whitepapers";
				break;
			case "news":
				redirectUrl = slug ? `/news/${slug}` : "/news";
				break;
			case "press":
				redirectUrl = slug ? `/news/${slug}` : "/news";
				break;
			case "homePage":
				redirectUrl = "/";
				break;
			case "platformPage":
				redirectUrl = "/platform";
				break;
			case "methodologyPage":
				redirectUrl = "/methodology";
				break;
			case "californiaPage":
				redirectUrl = "/created-in-california";
				break;
			case "companyPage":
				redirectUrl = "/company";
				break;
			case "caseStudiesPage":
				redirectUrl = "/case-studies";
				break;
			case "newsPage":
				redirectUrl = "/news";
				break;
			case "careersPage":
				redirectUrl = "/careers";
				break;
			case "blogPage":
				redirectUrl = "/blog";
				break;
			case "contactPage":
				redirectUrl = "/contact";
				break;
			case "consultationPage":
				redirectUrl = "/book-a-consultation";
				break;
			case "privacyPage":
				redirectUrl = "/privacy";
				break;
			case "termsPage":
				redirectUrl = "/terms";
				break;
			case "securityPage":
				redirectUrl = "/security";
				break;
			case "soc3Page":
				redirectUrl = "/soc-3";
				break;
			case "basicPages":
				redirectUrl = slug ? `/methodology/${slug}` : "/methodology";
				break;
			default:
				redirectUrl = "/";
		}
	}

	// Add draft mode indicator to the URL
	redirectUrl = `${redirectUrl}${redirectUrl.includes("?") ? "&" : "?"}draftMode=true&id=${id || ""}`;

	// Create the response with a redirect
	const response = NextResponse.redirect(new URL(redirectUrl, request.url));

	// Set preview cookie
	response.cookies.set("__next_preview_data", "true", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60, // 1 hour
		path: "/",
	});

	return response;
}
