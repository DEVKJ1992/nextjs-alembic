/** @type {import('next-sitemap').IConfig} */
import { sanityClient } from "./src/sanity/sanity.js";

const config = {
	// 1. Core Settings
	siteUrl: "https://alembic.com",
	generateRobotsTxt: true,

	// 2. KEY CHANGE: Setting sitemapSize to 0 generates a single sitemap (sitemap.xml).
	// The default is typically 50000, so any number > 0 enables splitting.
	sitemapSize: 50000,

	// Optional: Exclude specific paths (This remains great for static exclusions)
	exclude: ["/admin/*", "/private/*"],

	// 3. Dynamic Routes: Combined Fetch and Mapping Logic
	additionalPaths: async () => {
		// --- Fetch Slugs from Sanity ---
		const postQuery = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`;
		const whitepaperQuery = `*[_type == "whitepaper" && type == "Whitepaper" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`;
		const caseStudyQuery = `*[_type == "whitepaper" && type == "Case-Study" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`;

		const [posts, whitepapers, caseStudies] = await Promise.all([
			sanityClient.fetch(postQuery),
			sanityClient.fetch(whitepaperQuery),
			sanityClient.fetch(caseStudyQuery),
		]);

		// --- Sitemap Entry Mapping ---
		const mapToSitemapEntry = (slug, locPrefix = "") => ({
			loc: `${locPrefix}/${slug}`,
			changefreq: "daily",
			priority: 0.7,
			// Note: You might want to use the actual update date from Sanity here
			// instead of `new Date().toISOString()` for better SEO.
			lastmod: new Date().toISOString(),
		});

		const dynamicPosts = posts.map((post) =>
			mapToSitemapEntry(post.slug, "")
		);
		const dynamicWhitepapers = whitepapers.map((post) =>
			mapToSitemapEntry(post.slug, "/whitepapers")
		);
		const dynamicCaseStudies = caseStudies.map((post) =>
			mapToSitemapEntry(post.slug, "/case-studies")
		);

		// Static Indexes
		const staticIndexes = [
			mapToSitemapEntry("blog"),
			mapToSitemapEntry("news"),
		];

		return [
			...dynamicPosts,
			...dynamicWhitepapers,
			...dynamicCaseStudies,
			...staticIndexes,
		];
	},

	// 4. REMOVED: The `transform` function is redundant when `additionalPaths`
	// already defines all the necessary properties (changefreq, priority, lastmod)
	// for dynamic routes, and the default behavior is sufficient for static files.
};

export default config;
