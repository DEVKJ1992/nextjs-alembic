import { Metadata } from "next";
import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import TalkForm from "./form";
import { headers } from "next/headers";

const query = `*[_type == "consultationPage"][0]{_id, seo}`;
const options = { next: { revalidate: 600 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const headersList = await headers();
		const host = headersList.get("host");
		const protocol = headersList.get("x-forwarded-proto") || "https";
		const canonicalUrl = `${protocol}://${host}/book-a-consultation`;
		return {
			title: page.seo?.metaTitle
				? page.seo?.metaTitle + " | Alembic"
				: page.title
					? page?.title + " | Alembic"
					: "Alembic",
			description:
				page.seo?.metaDescription ?? "Contact us for more information",
			openGraph: {
				title: page.seo?.metaTitle + " | Alembic",
				description: page.seo?.metaDescription,
			},
			twitter: {
				title: page.seo?.metaTitle + " | Alembic",
				description: page.seo?.metaDescription,
			},
			alternates: {
				canonical: canonicalUrl,
			},
		};
	} catch (error) {
		console.error("Failed to fetch page data", error);
		return {
			title: "Alembic",
			description: "Contact us for more information",
		};
	}
}

export default function ConsultationPage() {
	return <TalkForm />;
}
