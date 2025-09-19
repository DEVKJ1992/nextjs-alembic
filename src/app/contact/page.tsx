import { Metadata } from "next";
import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import ContactForm from "./form";
import { SITE_URL } from "../constants/site";
import { getData } from "../utility-functions";
import { PortableTextBlock } from "sanity";

const query = `*[_type == "contactPage"][0]{_id, seo}`;
const options = { next: { revalidate: 3600 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/contact`;
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

type FormPage = {
	eyeBrowTitle: string;
	pageTitle: string;
	body: PortableTextBlock[];
	footer: {
		title: string;
		text: string;
		buttonText: string;
		buttonURL: string;
	};
};

export default async function ContactPage() {
	const data = (await getData(
		`*[_type == "contactPage"][0]`,
		"Contact Page"
	)) as FormPage | null;

	if (!data) {
		return null;
	}

	return <ContactForm data={data} />;
}
