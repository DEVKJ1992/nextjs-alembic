import { PortableText, type SanityDocument } from "next-sanity";
import { getData, components } from "../utility-functions";
import { Metadata } from "next";
import FooterSection from "../template-parts/footer-section";
import { client } from "@/sanity/client";
import { SITE_URL } from "../constants/site";
import { Banner } from "../template-parts/banner";

const query = `*[_type == "cesPage"][0]{_id, seo}`;
const options = { next: { revalidate: 86400 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/ces2026`;
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

export default async function CESPage(){
	const data = await getData(`*[_type == "cesPage"][0]`, "CES Page");

	return (
		<div className="pt-20">
			<Banner 
			data={data?.banner || null}
			bannerVideo={data?.bannerVideo}
			/>
			<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
				{data?.youtubeVideoLink && (
					<div className="mb-10 mt-20">
						<iframe style={{width: "100%", height: "690px"}} width="560" height="315" src={data?.youtubeVideoLink} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
					</div>
				)}
				<div className="mb-10 mt-20">
					<h2 className="text-center">{data?.pageTitle}</h2>
				</div>
				<div className="max-w-[100%] m-auto">
					<PortableText value={data?.body} components={components} />
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
