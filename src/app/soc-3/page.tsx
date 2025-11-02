import React from "react";
import FooterSection from "../template-parts/footer-section";
import { PortableText, type SanityDocument } from "next-sanity";
import { getData, components, Links } from "../utility-functions";
import TextLinks from "../template-parts/legal-nav";
import { Metadata } from "next";
import { SITE_URL } from "../constants/site";
import { client } from "@/sanity/client";
import Button from "../components/Button";

const query = `*[_type == "soc3Page"][0]{_id, seo}`;
const options = { next: { revalidate: 86400 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/soc-3`;
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

export default async function SOC3Page() {
	const data = await getData(`*[_type == "soc3Page"][0]`, "SOC3 Page");

	return (
		<div className="pt-20">
			<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
				<TextLinks />
				<div className="max-w-[700px] mb-10">
					<h1 className="md:text-[64px] text-[36px] md:leading-[70px] leading-[45px]">
						{data?.pageTitle}
					</h1>
					<PortableText value={data?.body} components={components} />
				</div>
				{data?.reports?.map((report: Links) => (
					<Button
						href={report.url}
						variant="primary"
						className="mr-5 mb-5"
						externalLink
						key={report._key}
					>
						{report.title}
					</Button>
				))}
			</div>

			{data?.footer && (
				<FooterSection
					title={data.footer.title}
					body={data.footer.text}
					ctaText={data.footer.buttonText}
					ctaUrl={data.footer.buttonURL}
				/>
			)}
		</div>
	);
}
