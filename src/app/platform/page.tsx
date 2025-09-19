import Image from "next/image";
import TestimonialSlider from "../template-parts/testimonials/testimonials-slider";
import { StickyImage } from "../template-parts/sticky-image";
import { VideoOffsetContent } from "../template-parts/video-offset-content";
import ThreeColumnBlog from "../template-parts/three-column-blog";
import FooterSection from "../template-parts/footer-section";
import { getData, urlFor, IconWithText } from "../utility-functions";
import { Banner } from "../template-parts/banner";
import { PortableText, type SanityDocument } from "next-sanity";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import Button from "../components/Button";
import { SITE_URL } from "../constants/site";

const query = `*[_type == "platformPage"][0]{_id, seo}`;
const options = { next: { revalidate: 3600 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/platform`;
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

export default async function PlatformIndexPage() {
	const data = await getData(
		`*[_type == "platformPage"][0]{..., "bannerVideo": banner.backgroundVideo.asset->url}`,
		"Platform Page"
	);

	return (
		<div className="Platform-parent">
			{/* Banner Section */}
			<Banner
				data={data?.banner || null}
				bannerVideo={data?.bannerVideo}
			/>
			{/* Banner Section */}

			{/* testimonial slider */}
			<div className="slider-testimonial">
				<div className="banner max-w-[1220px] mx-auto py-20 md:py-36 xl:px-0 px-5">
					<div className="col-head flex items-center gap-5 relative">
						<p className="text-[14px] w-[35%] tracking-[1.4px] architekt uppercase">
							CUSTOMERS WHO TRUST ALEMBIC
						</p>
						<hr className="w-[100%] border-black" />
						<Image
							src="/images/quote.svg"
							alt=""
							width={50}
							height={50}
							className="absolute md:top-0 top-[25px] left-[36%]"
						></Image>
					</div>
					<TestimonialSlider initialSlide={2} />
				</div>
			</div>
			{/* testimonial slider */}
			<div id="explore-platform"></div>
			<div className="py-18">
				<div className=" p-8 max-w-[1220px]  mx-auto">
					<h3 className="text-[var(--alembic-black)] md:text-[96px] md:leading-[96px] font-semibold pb-10 text-sm-[40px] leading-sm-[42px]">
						{data?.pride?.titleWithText.title}
					</h3>
					<div className="md:max-w-[50%]">
						<PortableText
							value={data?.pride?.titleWithText?.text}
						/>
					</div>

					<Button
						href={data?.pride?.ctaUrl}
						variant="primary"
						className="my-12"
					>
						{data?.pride?.ctaText}
					</Button>
				</div>
			</div>

			<div
				className="pt-20 pb-40 banner-bg bg-center bg-no-repeat bg-cover"
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

			<VideoOffsetContent data={data?.videoSection || null} />

			<div className="text-section bg-[#F5FAFF] py-20 overflow-hidden">
				<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
					<div className="">
						<h3 className="xl:text-[96px] lg:text-[80px] md:text-[60px] text-[36px] xl:leading-[96px] lg:leading-[96px] md:leading-[60px] leading-[40px] md:mb-20 mb-10">
							{data?.iconsTextWithImage?.sectionTitle}
						</h3>
						<div className="md:max-w-[40%]">
							<PortableText
								value={data?.iconsTextWithImage?.sectionText}
							/>
						</div>

						<Button
							href={data?.iconsTextWithImage?.cta1Url}
							variant="primary"
							className="my-12"
						>
							{data?.iconsTextWithImage?.cta1Text}
						</Button>
						<div className="relative xl:ml-auto xl:mr-[-100px] lg:ml-auto lg:mr-[-140px] md:ml-auto md:mr-[-250px] overflow-hidden max-w-[700px] xl:mt-[-500px] lg:mt-[-550px] md:mt-[-600px] sm:mt-[0px]">
							<Image
								src={
									urlFor(
										data?.iconsTextWithImage?.image
									)?.url() ?? ""
								}
								alt="Alembic secure enterprise-grade solution"
								width={786}
								height={584}
								className="w-full h-auto object-cover"
							/>
						</div>
					</div>
					<div className="flex flex-wrap gap-5 justify-between mt-10 border-b-4 border-[#8B71F6]">
						{data?.iconsTextWithImage?.iconsText?.map(
							(item: IconWithText) => (
								<div
									className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 py-5"
									key={item._key}
								>
									{item.icon && (
										<Image
											src={urlFor(item.icon)?.url() ?? ""}
											alt=""
											width={32}
											height={32}
											className="max-w-[32px] w-full h-auto object-cover mb-5"
										/>
									)}
									<h4 className="md:text-[32px] text-[26px] font-medium leading-none p-0">
										{item.title}
									</h4>
								</div>
							)
						)}

						<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5">
							<Button
								href={data?.iconsTextWithImage?.cta2Url}
								variant="primary"
								className="ml-auto"
							>
								{data?.iconsTextWithImage?.cta2Text}
							</Button>
						</div>
					</div>
				</div>
			</div>
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
