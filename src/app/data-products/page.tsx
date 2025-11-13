import React from "react";
import { getData } from "../utility-functions";
import { Banner2 } from "../template-parts/banner2";
import { type SanityDocument } from "next-sanity";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { SITE_URL } from "../constants/site";
import FooterSection from "../template-parts/footer-section";
import { VideoOffsetContent } from "../template-parts/video-offset-content";
import Image from "next/image";
import { urlFor } from "../utility-functions";
import { AlternatingSection } from "../template-parts/alternating-section";

const query = `*[_type == "dataproductsPage"][0]{_id, seo}`;
const options = { next: { revalidate: 86400 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/data-products`;
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

export default async function AILab() {
	const data = await getData(
		`*[_type == "dataproductsPage"][0]{..., "bannerVideo": banner2.backgroundVideo.asset->url}`,
		"Data Products Page"
	);

	return (
		<div className="overflow-hidden">
			{/* Banner Section */}
			<Banner2
				data={data?.banner2 || null}
				bannerVideo={data?.bannerVideo}
			/>
			{/* Banner Section */}

			<div className="max-w-[1440px] m-auto text-center mt-20">
				<h3 className="font-medium pb-2">{data?.titleImage?.title}</h3>
				<p className="text-[36px]">{data?.titleImage?.subtitle}</p>
				<div>
					{data?.titleImage?.image && (
						<Image
							src={urlFor(data?.titleImage?.image)?.url() ?? ""}
							alt=""
							fill
							className="object-cover !relative"
						/>
					)}
				</div>
			</div>

			{/* alt sec */}
			<AlternatingSection data={data?.altSections || null} />
			{/* alt sec */}

			{/* video sec */}
			<VideoOffsetContent data={data?.videoSection || null} />
			{/* video sec */}

			{data?.footer && (
				<FooterSection
					title={data.footer.title}
					body={data.footer.text}
					ctaText={data.footer.buttonText}
					ctaUrl={data.footer.buttonURL}
					titleSm={true}
				/>
			)}
		</div>
	);
}
