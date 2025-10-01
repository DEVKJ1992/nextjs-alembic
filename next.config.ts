import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: ["*"],
		},
	},
	serverExternalPackages: [],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				port: "",
				pathname: "/**",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains; preload",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "geolocation=(), microphone=(), camera=()",
					},
					{
						key: "Content-Security-Policy",
						value: `
							default-src 'self';
							script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io https://*.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com https://app.termly.io https://challenges.cloudflare.com https://www.google-analytics.com https://snap.licdn.com;
							style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
							img-src 'self' data: blob: https://cdn.sanity.io https://*.shopifycdn.com https://i.ytimg.com https://px.ads.linkedin.com;;
							font-src 'self' https://fonts.gstatic.com;
							connect-src 'self' https://cdn.sanity.io https://*.ingest.sentry.io https://analytics.google.com https://www.google-analytics.com;
							frame-src https://www.youtube.com https://www.youtube-nocookie.com;
							frame-ancestors 'none';
							object-src 'none';
							base-uri 'self';
						`
							.replace(/\s{2,}/g, " ")
							.trim(),
					},
				],
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/book-a-demo/",
				destination: "/book-a-consultation/",
				permanent: true,
			},
			{
				source: "/predictive-data-visualization-software-platform/",
				destination: "/platform/",
				permanent: true,
			},
			{
				source: "/data-visualization-platform-alembic/",
				destination: "/methodology/",
				permanent: true,
			},
			{
				source: "/data-integration-visualization-whitepapers/whitepaper-number-2/",
				destination: "/case-studies/higher-ed/",
				permanent: true,
			},
			{
				source: "/data-integration-visualization-whitepapers/whitepaper-number-3/",
				destination: "/case-studies/b2b/",
				permanent: true,
			},
			{
				source: "/whitepaper-number-1/",
				destination: "/case-studies/sporting-goods/",
				permanent: true,
			},
			{
				source: "/data-integration-visualization-whitepapers/",
				destination: "/whitepapers/gartner/",
				permanent: true,
			},
			{
				source: "/about-alembic-data-analytics-tool/",
				destination: "/company/",
				permanent: true,
			},
			{
				source: "/contact-data-analytics-company/",
				destination: "/contact/",
				permanent: true,
			},
			{
				source: "/ai-marketing-data-visualization-tool/",
				destination: "/solutions/marketing/",
				permanent: true,
			},
			{
				source: "/industries/",
				destination: "/solutions/industries/",
				permanent: true,
			},
			{
				source: "/terms-of-service/",
				destination: "/terms/",
				permanent: true,
			},
			{
				source: "/responsible-disclosure/",
				destination: "/security/",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
