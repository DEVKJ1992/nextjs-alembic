/** @type {import('next-sitemap').IConfig} */
import { sanityClient } from "./src/sanity/sanity.js";

const config = {
	siteUrl: "https://getalembic.com",
	generateRobotsTxt: true,
	sitemapSize: 7000,
	// Optional: Exclude specific paths
	exclude: ["/admin/*", "/private/*"],
	// Optional: Add dynamic routes
	additionalPaths: async () => {
		// Fetch slugs from Sanity
		const postQuery = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`;
		const whitepaperQuery = `*[_type == "whitepaper" && type == "Whitepaper" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`;
		const caseStudyQuery = `*[_type == "whitepaper" && type == "Case-Study" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`;
		const posts = await sanityClient.fetch(postQuery);
		const whitepapers = await sanityClient.fetch(whitepaperQuery);
		const caseStudies = await sanityClient.fetch(caseStudyQuery);

		// Map slugs to sitemap entries
		const dynamicPosts = posts.map((post) => ({
			loc: `/${post.slug}`, // Adjust path based on your route structure
			changefreq: "daily",
			priority: 0.7,
			lastmod: new Date().toISOString(),
		}));

		const dynamicWhitepapers = whitepapers.map((post) => ({
			loc: `/whitepapers/${post.slug}`, // Adjust path based on your route structure
			changefiesreq: "daily",
			priority: 0.7,
			lastmod: new Date().toISOString(),
		}));

		const dynamicCaseStudies = caseStudies.map((post) => ({
			loc: `/case-studies/${post.slug}`, // Adjust path based on your route structure
			changefreq: "daily",
			priority: 0.7,
			lastmod: new Date().toISOString(),
		}));

		const blogIndex = {
			loc: "/blog",
			changefreq: "daily",
			priority: 0.7,
			lastmod: new Date().toISOString(),
		};

		const newsIndex = {
			loc: "/news",
			changefreq: "daily",
			priority: 0.7,
			lastmod: new Date().toISOString(),
		};

		return [
			...dynamicPosts,
			...dynamicWhitepapers,
			...dynamicCaseStudies,
			blogIndex,
			newsIndex,
		];
	},
	transform: async (config, path) => {
		return {
			loc: path,
			changefreq: "daily",
			priority: 0.7,
			lastmod: new Date().toISOString(),
		};
	},
};

export default config;
