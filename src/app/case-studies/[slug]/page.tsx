import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import CaseStudiesPage from "./case-studies-page";
import { Metadata } from "next";
import { SITE_URL } from "../../constants/site";

const POST_QUERY = `*[_type == "whitepaper" && type == "Case-Study" && slug.current == $slug][0]{_id, title, eyebrowTitle, shortTitle, description, slug, metaImage, metaTitle, metaDescription, url, "whitepaperURL": uploadWhitepaper.asset->url}`;

const options = { next: { revalidate: 86400 } };

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const whitepaper = await client.fetch<SanityDocument>(
		POST_QUERY,
		await params,
		options
	);

	const canonicalUrl = `${SITE_URL}/case-studies/${(await params).slug}`;

	return {
		title: whitepaper.metaTitle
			? whitepaper.metaTitle + " | Alembic"
			: whitepaper.shortTitle
				? whitepaper?.shortTitle + " | Alembic"
				: "White Paper | Alembic",
		description: whitepaper.metaDescription
			? whitepaper.metaDescription
			: "contact us for more information",
		alternates: {
			canonical: canonicalUrl,
		},
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const whitepaper = await client.fetch<SanityDocument>(
		POST_QUERY,
		await params,
		options
	);

	return <CaseStudiesPage whitepaper={whitepaper} />;
}
