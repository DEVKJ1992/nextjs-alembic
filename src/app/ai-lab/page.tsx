import React from "react";
import { getData } from "../utility-functions";
import { Banner2 } from "../template-parts/banner2";
import { PortableText, type SanityDocument } from "next-sanity";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { SITE_URL } from "../constants/site";
import Image from "next/image";
import { urlFor } from "../utility-functions";
import Button from "../components/Button";
import Link from "next/link";

const query = `*[_type == "ailabPage"][0]{_id, seo}`;
const options = { next: { revalidate: 86400 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/ai-lab`;
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
		`*[_type == "ailabPage"][0]{..., "bannerVideo": banner2.backgroundVideo.asset->url}`,
		"AI Lab Page"
	);

	return (
		<div className="overflow-hidden">
			{/* Banner Section */}
			<Banner2
				data={data?.banner2 || null}
				bannerVideo={data?.bannerVideo}
			/>
			{/* Banner Section */}

			<div className="max-w-[1220px] mx-auto py-16 xl:px-0 px-5">
				<h2 className="text-center xl:text-[96px] lg:text-[80px] md:text-[60px] text-[40px] text-[var(--alembic-black)] xl:leading-[92px] lg:leading-[92px] font-semibold md:leading-[60px] leading-[45px] z-10 relative">
					{data?.titleWithText2?.title}
				</h2>
				<h3 className="pb-0">{data?.titleWithText2?.subtitle}</h3>
				<div className="font-medium md:max-w-[50%] md:mt-5 mt-0">
					<PortableText value={data?.titleWithText2?.text} />
				</div>
				<div className="block lg:flex">
					<div className="lg:w-[49%] w-[100%]">
						{data?.titleWithText2?.iconWithText &&
							data.titleWithText2.iconWithText.map(
								(item: SanityDocument) =>
									item && (
										<div
											className={`lg:w-[70%] w-[90%] mx-auto my-10 flex flex-col`}
											key={item._key}
										>
											{item?.icon && (
												<Image
													src={
														urlFor(
															item?.icon
														)?.url() ?? ""
													}
													alt=""
													width="24"
													height="24"
												/>
											)}
											<p className="mt-4">
												{item.text}
											</p>{" "}
										</div>
									)
							)}
					</div>
					{data?.titleWithText2?.image && (
						<Image
							src={
								urlFor(data?.titleWithText2?.image)?.url() ?? ""
							}
							alt={data?.titleWithText2?.title}
							width={1000}
							height={500}
							className="ml-auto xl:mr-[-6vw] lg:w-[49%] w-[100%] mt-5"
						></Image>
					)}
				</div>
			</div>

			{/* text section */}
			<div className="text-section py-20">
				<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
					<h3 className="max-w-[630px] font-medium">
						{data?.iconsText?.title}
					</h3>
					<p className="max-w-[570px] my-5 ml-auto">
						{data?.iconsText?.body}
					</p>
					<div className="flex flex-wrap gap-5 justify-between mt-10 border-b-4 border-[#8B71F6]">
						{data?.iconsText?.iconsText?.map(
							(item: SanityDocument) =>
								item && (
									<div
										className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 md:py-5"
										key={item._key}
									>
										{item?.icon && (
											<Image
												src={
													urlFor(item?.icon)?.url() ??
													""
												}
												alt=""
												width={24}
												height={24}
											></Image>
										)}
										<h4 className="min-h-[70px] md:text-[32px] text-[26px] leading-[32px] font-medium mt-2">
											{item.title}
										</h4>
										<p>{item.text}</p>
									</div>
								)
						)}

						<div className="w-[47%] flex flex-col gap-5 pb-5"></div>
						<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 mt-10">
							<div className="flex flex-col gap-5">
								<Button
									href={data?.iconsText?.ctaUrl}
									variant="primary"
									className="ml-auto"
								>
									{data?.iconsText?.ctaText}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* text section */}

			{/* faq section */}
			<div className="text-section py-20">
				<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
					<div className="border-b-2 border-[#050A24]">
						<h3 className="max-w-[1100px] xl:text-[96px] lg:text-[80px] md:text-[60px] xl:leading-[96px] lg:leading-[96px] md:leading-[60px]">
							FAQ
						</h3>
					</div>
					<div className="mt-10">
						{data?.faq?.map(
							(item: SanityDocument) =>
								item && (
									<div
										className="md:w-[860px] w-[100%] flex flex-col gap-5 md:py-5"
										key={item._key}
									>
										<h4 className="md:text-[32px] text-[26px] leading-[32px] font-medium mt-5">
											{item.title}
										</h4>
										<PortableText value={item.text} />
									</div>
								)
						)}
					</div>
				</div>
			</div>
			{/* text section */}

			<div className="bg-[#8B71F6] max-w-[1220px] min-h-[483px] mx-auto pl-[32px] pr-[32px] py-[48px] mb-20">
				<h3 className="max-w-[1090px] xl:text-[64px] lg:text-[50px] md:text-[40px] text-[30px] text-white font-normal xl:leading-[70px] lg:leading-[65px] md:leading-[55px] sm:leading-[45px] leading-[40px] tracking-[-2px] mb-8">
					Build the private AI backbone that proves what drives
					revenue for the world’s biggest brands.
				</h3>
				<Link
					href="/careers"
					className="architekt text-[#8B71F6] bg-white text-center px-[32px] py-[16px]"
				>
					Go to Careers &gt;
				</Link>
				<p className="text-large-alt mt-10">
					Learn about the history of Alembic,{" "}
					<a
						href="/created-in-california"
						className="text-[var(--alembic-black)]"
					>
						Created in California
					</a>
				</p>
			</div>
		</div>
	);
}
