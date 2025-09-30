import React from "react";
import { type SanityDocument } from "next-sanity";
import { getData, urlFor, Logo } from "../utility-functions";
import Image from "next/image";
import { client } from "@/sanity/client";
import FooterSection from "../template-parts/footer-section";
import { Metadata } from "next";
import { SITE_URL } from "../constants/site";
import Button from "../components/Button";

const POSTS_QUERY = `*[
  _type == "whitepaper"
  && defined(slug.current) && type == "Case-Study" && !(_id in path("drafts.**"))
]|order(publishedAt desc){_id, eyebrowTitle, shortTitle, shortDescription, slug}`;

const query = `*[_type == "caseStudiesPage"][0]{_id, pageTitle, seo}`;
const options = { next: { revalidate: 3600 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/case-studies`;
		return {
			title: page.seo?.metaTitle
				? page.seo?.metaTitle + " | Alembic"
				: page.pageTitle
				? page?.pageTitle + " | Alembic"
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

export default async function CaseStudiesIndexPage() {
	const caseStudies = await getData(
		`*[_type == "caseStudiesPage"][0]`,
		"Case Studies Page"
	);

	let whitepapers: SanityDocument[] = [];
	try {
		whitepapers = await client.fetch<SanityDocument[]>(
			POSTS_QUERY,
			{},
			options
		);
	} catch (error) {
		console.error("Failed to fetch whitepapers", error);
		return null;
	}

	return (
		<main>
			<div className="container max-w-[1280px] mx-auto min-h-screen p-8">
				<h1 className="mb-8 mt-4">{caseStudies?.pageTitle}</h1>

				<div className="">
					<div className="max-w-[1280px] mx-auto md:py-20 py-5">
						<h4 className="md:text-[32px] text-[28px] tracking-[-1px] font-semibold md:text-center">
							{caseStudies?.logosTitle}
						</h4>
						{caseStudies?.logos && (
							<div className="flex flex-wrap gap-12 justify-center pt-10">
								{caseStudies?.logos?.map((logo: Logo) => (
									<div
										className="max-w-[290px] max-h-[100px]"
										key={logo._key}
									>
										<Image
											src={urlFor(logo.logo)?.url() ?? ""}
											alt={logo.logo.alt ?? ""}
											width={300}
											height={100}
											className="w-full h-full"
										></Image>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="container mx-auto py-12">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{whitepapers?.map((whitepaper, index) => (
							<React.Fragment key={whitepaper._id}>
								{index % 2 === 0 ? (
									<>
										<div className="mt-8 sm:mt-0">
											<span className="architekt uppercase text-[var(--alembic-purple)]">
												{whitepaper.eyebrowTitle}
											</span>
											<h4 className="md:text-[32px] text-[26px] leading-[32px] font-medium my-4">
												{whitepaper.shortTitle}
											</h4>
											<p className="mb-4">
												{whitepaper.shortDescription}
											</p>
											<Button
												href={`/case-studies/${whitepaper.slug.current}`}
												variant="secondary"
												className="uppercase"
											>
												DOWNLOAD PDF
											</Button>
										</div>
										<div className="hidden md:block"></div>
									</>
								) : (
									<>
										<div className="hidden md:block"></div>
										<div className="mt-8 md:mt-0">
											<span className="architekt uppercase text-[var(--alembic-purple)]">
												{whitepaper.eyebrowTitle}
											</span>
											<h4 className="md:text-[32px] text-[26px] leading-[32px] font-medium my-4">
												{whitepaper.shortTitle}
											</h4>
											<p className="mb-4">
												{whitepaper.shortDescription}
											</p>
											<Button
												href={`/case-studies/${whitepaper.slug.current}`}
												variant="secondary"
											>
												DOWNLOAD PDF
											</Button>
										</div>
									</>
								)}
							</React.Fragment>
						))}
					</div>
				</div>
			</div>
			{caseStudies?.footer && (
				<FooterSection
					title={caseStudies?.footer?.title}
					body={caseStudies?.footer?.text}
					ctaText={caseStudies?.footer?.buttonText}
					ctaUrl={caseStudies?.footer?.buttonURL}
				/>
			)}
		</main>
	);
}
