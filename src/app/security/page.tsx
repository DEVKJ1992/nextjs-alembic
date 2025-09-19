import React from "react";
import Link from "next/link";
import { PortableText, type SanityDocument } from "next-sanity";
import {
	getData,
	components,
	ListItem,
	ContentItem,
} from "../utility-functions";
import FooterSection from "../template-parts/footer-section";
import TextLinks from "../template-parts/legal-nav";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { headers } from "next/headers";

const query = `*[_type == "securityPage"][0]{_id, seo}`;
const options = { next: { revalidate: 600 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const headersList = await headers();
		const host = headersList.get("host");
		const protocol = headersList.get("x-forwarded-proto") || "https";
		const canonicalUrl = `${protocol}://${host}/security`;
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

export default async function SecurityPage() {
	const data = await getData(
		`*[_type == "securityPage"][0]`,
		"Security Page"
	);

	return (
		<div className="pt-20">
			<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
				<TextLinks />
				<div className="max-w-[700px]">
					<h1 className="md:text-[64px] text-[36px] md:leading-[70px] leading-[45px]">
						{data?.pageTitle}
					</h1>
					<PortableText value={data?.body} components={components} />
				</div>
			</div>
			<div className="max-w-[1220px] mx-auto xl:px-0 px-5 relative">
				<h2 className="md:text-[64px] text-[36px] md:leading-[70px] leading-[45px] mt-12 mb-8">
					Table of contents
				</h2>
				<div className="flex flex-wrap gap-4 justify-between">
					<div className="w-[100%] md:w-[35%] md:sticky top-15">
						<ol className="md:sticky top-20 md:list-decimal md:pl-5">
							{data?.list?.map((listItem: ListItem) => (
								<li
									key={listItem._key}
									className="text-[var(--alembic-purple)]"
								>
									<Link
										href={`#${listItem.listID}`}
										className="text-[var(--alembic-black)] hover:text-[var(--alembic-purple)]"
									>
										{listItem.listItem}
									</Link>
								</li>
							))}
						</ol>
					</div>
					<div className="w-[100%] md:w-[62%]">
						{data?.content?.map(
							(contentItem: ContentItem, index: number) => (
								<div key={contentItem._key}>
									<h3
										id={contentItem.id}
										className="text-[32px] py-5 font-semibold"
									>
										{index + 1}. {contentItem.title}
									</h3>
									<div className="w-full break-words">
										<PortableText
											value={contentItem.text}
											components={components}
										/>
									</div>
								</div>
							)
						)}
					</div>
				</div>
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
