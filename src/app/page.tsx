import Image from "next/image";
import { VideoOffsetContent } from "./template-parts/video-offset-content";
import ThreeColumnBlog from "./template-parts/three-column-blog";
import FooterSection from "./template-parts/footer-section";
import { getData, urlFor, components } from "./utility-functions";
import { PortableText, type SanityDocument } from "next-sanity";
import { BannerWithQuote } from "./template-parts/banner-with-quote";
import Button from "./components/Button";

export default async function IndexPage() {
	const home = await getData(
		`*[_type == "homePageNew"][0]{..., "bannerVideo": banner.backgroundVideo.asset->url}`,
		"Home Page New",
	);

	return (
		<main className="mx-auto min-h-screen">
			{/* Banner Section */}
			<BannerWithQuote
				data={home?.banner || null}
				bannerVideo={home?.bannerVideo}
			/>
			{/* Banner Section */}

			{/* text with image section */}
			<div className="text-section py-20 overflow-hidden">
				<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
					<div className="">
						<h2 className="font-semibold md:mb-20 mb-10">
							{home?.textWithImage?.sectionTitle}
						</h2>
						<div className="md:max-w-[40%]">
							<PortableText
								value={home?.textWithImage?.sectionText}
							/>
						</div>

						{home?.textWithImage?.cta1Text && (
							<Button
								href={home?.textWithImage?.cta1Url}
								variant="primary"
								className="my-12"
							>
								{home?.textWithImage?.cta1Text}
							</Button>
						)}
						<div className="relative xl:ml-auto xl:mr-[-100px] lg:ml-auto lg:mr-[-140px] md:ml-auto md:mr-[-250px] overflow-hidden max-w-[700px] lg:mt-[-400px] md:mt-[-450px] sm:mt-[0px]">
							<Image
								src={
									urlFor(home?.textWithImage?.image)?.url() ??
									""
								}
								alt="Alembic secure enterprise-grade solution"
								width={786}
								height={584}
								className="w-full h-auto object-cover border border-gray-200 rounded-lg"
							/>
						</div>
					</div>
				</div>
			</div>
			{/* text with image section */}

			{/* case study section */}
			<div className="text-section pt-[50px] pb-[100px]">
				<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
					<h3 className="max-w-[632px] xl:text-[48px] lg:text-[48px] md:text-[36px] md:leading-[50px]">
						{home?.caseStudies?.sectionTitle}
					</h3>
					<div className="flex flex-wrap gap-5 justify-between mt-10">
						<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 py-5">
							<h4 className="text-[30px] font-medium leading-none mt-5">
								{home?.caseStudies?.title1}
							</h4>
							<p className="min-h-[100px]">
								{home?.caseStudies?.text1}
							</p>
							<Button
								href={home?.caseStudies?.cta1Url}
								variant="secondary"
							>
								{home?.caseStudies?.cta1Text}
							</Button>
						</div>
						<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 py-5">
							<h4 className="text-[30px] font-medium mt-5 leading-none">
								{home?.caseStudies?.title2}
							</h4>
							<p className="min-h-[132px]">
								{home?.caseStudies?.text2}
							</p>
							<Button
								href={home?.caseStudies?.cta2Url}
								variant="secondary"
							>
								{home?.caseStudies?.cta2Text}
							</Button>
						</div>
					</div>
				</div>
			</div>
			{/* case study section */}

			{/* text section */}
			<div className="text-section max-w-[1220px] mx-auto px-10 bg-[#F5FAFF] py-20">
				<div className="mx-auto">
					<div className="border-b-2 border-[#050A24]">
						<h3 className="max-w-[632px] xl:text-[48px] lg:text-[48px] md:text-[36px] md:leading-[50px]">
							{home?.iconsText?.title}
						</h3>
						<p
							className="my-5"
							dangerouslySetInnerHTML={{
								__html: home?.iconsText?.body || "",
							}}
						/>
					</div>
					<div className="flex flex-wrap gap-5 justify-between mt-10 border-b-4 border-[#8B71F6]">
						{home?.iconsText?.iconsText?.map(
							(item: SanityDocument, index: number) =>
								item && (
									<div
										className={`${
											index === 0
												? "w-full"
												: "xl:w-[47%] md:w-[47%] w-full"
										} flex flex-col gap-5 md:py-5`}
										key={item._key}
									>
										{item?.icon ? (
											<Image
												src={
													urlFor(item?.icon)?.url() ??
													""
												}
												alt=""
												width={32}
												height={32}
											></Image>
										) : (
											""
										)}
										<h4 className="md:text-[32px] text-[26px] leading-[32px] font-medium mt-5">
											{item.title}
										</h4>
										<p>{item.text}</p>
									</div>
								),
						)}

						<div className="w-[47%] flex flex-col gap-5 py-5"></div>
						<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5">
							<Button
								href={home?.iconsText?.ctaUrl}
								variant="primary"
								className="ml-auto"
							>
								{home?.iconsText?.ctaText}
							</Button>
						</div>
					</div>
				</div>
			</div>
			{/* text section */}

			<div className="max-w-[1220px] m-auto xl:px-0 px-5">
				<PortableText value={home?.body} components={components} />
			</div>

			{/* video sec */}
			<VideoOffsetContent data={home?.videoSection || null} />
			{/* video sec */}

			<div className="md:h-[50px] h-0"></div>

			{/* blogs section */}
			<ThreeColumnBlog />
			{/* blogs section */}

			<div className="h-[50px]"></div>

			{home?.footer && (
				<FooterSection
					title={home.footer.title}
					body={home.footer.text}
					ctaText={home.footer.buttonText}
					ctaUrl={home.footer.buttonURL}
				/>
			)}
		</main>
	);
}
