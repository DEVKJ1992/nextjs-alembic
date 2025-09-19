import { createClient } from "@sanity/client";

export const sanityClient = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Replace with your Sanity project ID
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // Replace with your dataset name
	apiVersion: "2025-01-01", // Use a recent API version
	useCdn: true,
	timeout: 10000,
});
