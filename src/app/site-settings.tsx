import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";

export default async function siteSettings() {
	const query = `*[_type == "siteSettings"][0]`;
	const options = { next: { revalidate: 600 } };

	let siteSettings: SanityDocument | null = null;

	try {
		siteSettings = await client.fetch<SanityDocument>(query, {}, options);
	} catch (error) {
		console.error("Failed to site settings data", error);
		return null;
	}

	return {
		siteSettings,
	};
}
