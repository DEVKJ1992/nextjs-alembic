import Image from "next/image";
import { StickyImage } from "../template-parts/sticky-image";
import { VideoOffsetContent } from "../template-parts/video-offset-content";
import GartnerBlock from "../template-parts/gartner/gartner-block";
import ThreeColumnBlog from "../template-parts/three-column-blog";
import FooterSection from "../template-parts/footer-section";
import { Banner } from "../template-parts/banner";
import { getData, urlFor, IconWithText } from "../utility-functions";
import { PortableText, type SanityDocument } from "next-sanity";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { SITE_URL } from "../constants/site";
import Button from "../components/Button";
import ContentImage from "../template-parts/content-image";

const query = `*[_type == "methodologyPage"][0]{_id, seo}`;
const options = { next: { revalidate: 86400 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/methodology`;
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

export default async function AppliedScienceIndexPage() {
	const data = await getData(
		`*[_type == "methodologyPage"][0]{..., "bannerVideo": banner.backgroundVideo.asset->url, "mathWP": mathStickySection.uploadCtaWhitepaper.asset->url}`,
		"Methodology Page"
	);

	return (
		<div className="Methodology-parent">
			{/* Banner Section */}
			<Banner
				data={data?.banner || null}
				bannerVideo={data?.bannerVideo}
			/>
			{/* Banner Section */}

			<div
				className={`pt-20 pb-40 banner-bg bg-center bg-no-repeat bg-cover ${data?.titleText?.solidBackground ? "force-mobile-bg" : ""}`}
				style={{
					backgroundImage:
						"url(" +
						(urlFor(data?.titleText?.bgImage)?.url() ?? "") +
						")",
				}}
			>
				<div className="max-w-[1220px]  mx-auto md:px-0 px-8">
					<div className="flex flex-wrap flex-col gap-5 justify-between mt-10">
						<div className="w-[100%]">
							<h2 className="pb-10">
								{data?.titleText?.titleWithText.title}
							</h2>
						</div>
						<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 md:py-5">
							<PortableText
								value={data?.titleText?.titleWithText.text}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="sm:px-8 bg-[#F5FAFF]">
				<StickyImage data={data?.stickySection || null} instance={1} />
			</div>
			<div className="sm:px-8">
				<StickyImage
					data={data?.mathStickySection || null}
					instance={2}
					wpLink={data?.mathWP}
				/>
			</div>

			<ContentImage
				title={data?.computePower?.titleWithText?.title}
				body={data?.computePower?.titleWithText?.text}
				image={data?.computePower?.titleWithText?.image}
				ctaText={data?.computePower?.ctaText}
				ctaUrl={data?.computePower?.ctaUrl}
			/>

			<div className="py-10">
				<div className="max-w-[1220px]  mx-auto md:px-0 px-10">
					<div className="flex flex-wrap gap-5 justify-between mt-10">
						<div className="w-[100%]">
							<h2 className="md:max-w-[50%] text-[#050A24] font-medium text-[48px] leading-[normal]">
								{data?.privacyFirst?.sectionTitle}
							</h2>
						</div>
						<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 md:py-5 mt-0 md:mt-5">
							<h3 className="text-[#050A2] text-[32px] leading-[35px] font-medium">
								{data?.privacyFirst?.column1Title}
							</h3>
							{data?.privacyFirst?.column1Text}
						</div>
						<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 md:py-5 mt-0 md:mt-5">
							<h3 className="text-[#050A2] text-[32px] leading-[35px] font-medium">
								{data?.privacyFirst?.column2Title}
							</h3>
							{data?.privacyFirst?.column2Text}
						</div>
					</div>
				</div>
			</div>

			<VideoOffsetContent data={data?.videoSection || null} />

			<div className="text-section py-20 overflow-hidden">
				<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
					<div className="">
						<h2 className="font-semibold xl:text-[96px] lg:text-[80px] md:text-[60px] text-[36px] xl:leading-[96px] lg:leading-[96px] md:leading-[60px] leading-[45px] pb-10 border-b border-[#050A24]">
							{data?.iconsWithText?.sectionTitle}
						</h2>
					</div>
					<div className="flex flex-wrap gap-5 justify-between mt-10 border-b-4 border-[var(--alembic-purple)]">
						{data?.iconsWithText?.iconsText.map(
							(item: IconWithText) => (
								<div
									className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 py-5"
									key={item._key}
								>
									<Image
										src={urlFor(item?.icon)?.url() ?? ""}
										alt=""
										width={32}
										height={32}
									></Image>

									<h3 className="md:text-[32px] text-[26px] leading-[32px] font-medium mt-5 p-0">
										{item?.title}
									</h3>
									<p>{item?.text}</p>
								</div>
							)
						)}

						<div className="w-[47%] flex flex-col gap-5 py-5"></div>
						<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5">
							<Button
								href={data?.iconsWithText?.ctaUrl}
								variant="primary"
								className="ml-auto"
							>
								{data?.iconsWithText?.ctaText}
							</Button>
						</div>
					</div>
				</div>
			</div>

			<GartnerBlock />

			<div className="max-w-[1220px] mx-auto xl:px-0 px-5 py-10">
				<ThreeColumnBlog />
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
