import { createClient } from "next-sanity";

// Regular client for published content
export const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: "2025-01-01",
	token: process.env.SANITY_API_TOKEN,
	useCdn: true,
	timeout: 10000,
});

// Preview client for draft content
export const getClient = (preview = false) => {
	return createClient({
		projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
		dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
		apiVersion: "2025-01-01",
		token: process.env.SANITY_API_TOKEN,
		useCdn: false,
		perspective: preview ? "previewDrafts" : "published",
	});
};
