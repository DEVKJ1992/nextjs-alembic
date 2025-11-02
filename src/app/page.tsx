import Image from "next/image";
import TestimonialSlider from "./template-parts/testimonials/testimonials-slider";
import GartnerBlock from "./template-parts/gartner/gartner-block";
import { VideoOffsetContent } from "./template-parts/video-offset-content";
import ThreeColumnBlog from "./template-parts/three-column-blog";
import FooterSection from "./template-parts/footer-section";
import { type SanityDocument } from "next-sanity";
import { getData, urlFor } from "./utility-functions";
import { PortableText } from "next-sanity";
import { Banner } from "./template-parts/banner";
import Button from "./components/Button";

export default async function IndexPage() {
	const home = await getData(
		`*[_type == "homePage"][0]{..., "bannerVideo": banner.backgroundVideo.asset->url}`,
		"Home Page"
	);

	return (
		<main className="mx-auto min-h-screen">
			{/* Banner Section */}
			<Banner
				data={home?.banner || null}
				bannerVideo={home?.bannerVideo}
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
					<TestimonialSlider initialSlide={1} />
				</div>
			</div>
			{/* testimonial slider */}

			{/* text section */}
			<div className="text-section bg-[#F5FAFF] py-20">
				<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
					<div className="border-b-2 border-[#050A24]">
						<h3 className="max-w-[1100px] xl:text-[96px] lg:text-[80px] md:text-[60px] xl:leading-[96px] lg:leading-[96px] md:leading-[60px]">
							{home?.iconsText?.title}
						</h3>
						<p className="max-w-[570px] my-5 ml-auto">
							{home?.iconsText?.body}
						</p>
					</div>
					<div className="flex flex-wrap gap-5 justify-between mt-10 border-b-4 border-[#8B71F6]">
						{home?.iconsText?.iconsText?.map(
							(item: SanityDocument) =>
								item && (
									<div
										className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 md:py-5"
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
								)
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

			{/* alembic testimonial */}
			<div
				className={`data-operation py-20 bg-[right_center] bg-no-repeat bg-cover ${home?.testimonial?.solidBackground ? "force-mobile-bg" : ""}`}
				style={{
					backgroundImage:
						"url(" +
						(urlFor(home?.testimonial?.bgImage)?.url() ?? "") +
						")",
				}}
			>
				<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
					<h2 className="max-w-[847px] md:text-[48px] text-[28px] font-semibold lg:leading-[60px] leading-[35px] mx-auto">
						{home?.testimonial?.sectionTitle}
					</h2>
					<div className="flex flex-wrap gap-5 justify-between md:mt-20 mt-5">
						<div className="xl:w-[35%] lg:w-[32%] w-[100%]">
							<Image
								src={
									urlFor(home?.testimonial?.photo)?.url() ??
									""
								}
								alt=""
								width={350}
								height={350}
								className="w-[100%] max-w-[350px]"
							></Image>
						</div>
						<div className="lg:w-[63%] w-[100%] flex flex-col justify-center gap-5">
							<p className="max-w-[600px] font-medium">
								{home?.testimonial?.text}
							</p>
							<div className="auth flex xl:flex-row flex-col gap-3 justify-between xl:items-end items-start">
								<div className="auth-data flex flex-col">
									<p className="font-semibold py-1">
										{home?.testimonial?.name}
									</p>
									<p className="pb-5">
										{home?.testimonial?.designation}
									</p>
									<span className="w-full md:w-max architekt py-1 text-[#8B71F6]">
										{home?.testimonial?.bottomText}
									</span>
								</div>
								<div className="btn-box">
									<Button
										href={home?.testimonial?.ctaUrl}
										variant="primary"
										className="ml-auto"
									>
										{home?.testimonial?.ctaText}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* alembic testimonial */}

			{/* second banner section */}
			<div
				className={`second-banner-bg min-h-screen bg-center bg-no-repeat bg-cover ${home?.titleText?.solidBackground ? "force-mobile-bg" : ""}`}
				style={{
					backgroundImage:
						"url(" +
						(urlFor(home?.titleText?.bgImage)?.url() ?? "") +
						")",
				}}
			>
				<div className="banner max-w-[1220px] mx-auto py-36 xl:px-0 px-5">
					<div className="col max-w-[1113px]">
						<h3 className="xl:text-[96px] lg:text-[80px] md:text-[60px] text-[40px] text-[#050A24] xl:leading-[92px] lg:leading-[92px] leading-[50px] ">
							{home?.titleText?.titleWithText?.title}
						</h3>
						<div className="max-w-[589px] my-4">
							<PortableText
								value={home?.titleText?.titleWithText?.text}
							/>
						</div>
						<div className="btn-col max-w-[570px] flex flex-row flex-wrap gap-3">
							<Button
								href={home?.titleText?.ctaUrl}
								variant="primary"
							>
								{home?.titleText?.ctaText}
							</Button>
						</div>
					</div>
				</div>
			</div>
			{/* second banner section */}

			{/* text section */}
			<div className="text-section py-[150px]">
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
			{/* text section */}

			{/* Gartner container */}
			<GartnerBlock />
			{/* Gartner container */}

			{/* video sec */}
			<VideoOffsetContent data={home?.videoSection || null} />
			{/* video sec */}

			{/* text section */}
			<div className="text-section bg-[#F5FAFF] py-20 overflow-hidden">
				<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
					<div className="">
						<h3 className="xl:text-[96px] lg:text-[80px] md:text-[60px] xl:leading-[96px] lg:leading-[96px] md:leading-[60px]">
							{home?.iconsTextWithImage?.sectionTitle}
						</h3>
						<div className="relative xl:ml-auto xl:mr-[-100px] xl:mb-[-300px] lg:ml-auto lg:mr-[-140px] lg:mb-[-200px] md:ml-auto md:mr-[-250px] md:mb-[-150px] overflow-hidden max-w-[700px]">
							<Image
								src={
									urlFor(
										home?.iconsTextWithImage?.image
									)?.url() ?? ""
								}
								alt="Alembic secure enterprise-grade solution"
								width={786}
								height={584}
								className="w-full h-auto object-cover"
							/>
						</div>
					</div>
					<div className="flex flex-wrap gap-5 justify-between mt-10 border-b-4 border-[var(--alembic-purple)]">
						{home?.iconsTextWithImage?.iconsText?.map(
							(item: SanityDocument) =>
								item && (
									<div
										className={`xl:w-[47%] md:w-[47%] w-[100%] flex flex-col ${item.title?.trim() !== "" ? "gap-5 py-5" : ""}`}
										key={item._key}
									>
										{item?.icon ? (
											<Image
												src={
													urlFor(item?.icon)?.url() ??
													""
												}
												alt=""
												width="32"
												height="32"
											/>
										) : (
											""
										)}
										{item.title?.trim() !== "" && (
											<h4 className="md:text-[32px] text-[26px] leading-[32px] font-medium mt-5 p-0">
												{item.title}
											</h4>
										)}
										{item.text?.trim() !== "" && (
											<p>{item.text}</p>
										)}
									</div>
								)
						)}

						<div className="w-[47%] flex flex-col gap-5 py-5"></div>
						<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5">
							<Button
								href={home?.iconsTextWithImage?.ctaUrl}
								variant="primary"
								className="ml-auto"
							>
								{home?.iconsTextWithImage?.ctaText}
							</Button>
						</div>
					</div>
				</div>
			</div>
			{/* text section */}

			{/* blogs section */}
			<ThreeColumnBlog />
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
