import React from "react";
import Link from "next/link";
import Image from "next/image";
import ThreeColumnNews from "../template-parts/three-column-news";
import SubscribeForm from "../template-parts/subscribe/subscribe-form";
import { getData, urlFor, Stats } from "../utility-functions";
import { Banner } from "../template-parts/banner";
import { PortableText, type SanityDocument } from "next-sanity";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { SITE_URL } from "../constants/site";
import ContentImage from "../template-parts/content-image";

const query = `*[_type == "californiaPage"][0]{_id, seo}`;
const options = { next: { revalidate: 86400 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/created-in-california`;
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

export default async function CreatedCalifornia() {
	const data = await getData(
		`*[_type == "californiaPage"][0]{..., "bannerVideo": banner.backgroundVideo.asset->url}`,
		"California Page"
	);

	return (
		<div className="overflow-hidden">
			{/* Banner Section */}
			<Banner
				data={data?.banner || null}
				bannerVideo={data?.bannerVideo}
			/>
			{/* Banner Section */}

			<div className="max-w-[1220px] mx-auto md:py-24 py-10 border-b-2 border-[var(--alembic-black)] xl:px-0 px-5">
				<h2 className="xl:text-[96px] lg:text-[80px] md:text-[60px] text-[40px] text-[var(--alembic-black)] xl:leading-[92px] lg:leading-[92px] font-semibold leading-[45px] ">
					{data?.statsSection?.sectionTitle}
				</h2>
			</div>
			<div className="max-w-[1220px] flex flex-wrap gap-5 mx-auto md:py-16 py-5 xl:px-0 px-5">
				{data?.statsSection?.stats?.map((stat: Stats) => (
					<div className="md:flex-1 w-[100%]" key={stat._key}>
						<h4 className="text-[var(--alembic-purple)] font-medium text-[32px]">
							{stat.statNumber}
						</h4>
						<p className="md:max-w-[80%]">{stat.statText}</p>
					</div>
				))}
			</div>

			<ContentImage
				title={data?.titleWithText?.title}
				body={data?.titleWithText?.text}
				image={data?.titleWithText?.image}
			/>

			<div className="bg-color">
				<div className="max-w-[1220px] mx-auto md:py-32 py-10 xl:px-0 px-5">
					<h2 className="max-w-[750px] xl:text-[96px] md:pb-10 lg:text-[80px] md:text-[60px] text-[40px] text-[#050A24] xl:leading-[92px] lg:leading-[92px] font-semibold leading-[45px] ">
						{data?.titleText?.titleWithText?.title}
					</h2>
					<div className="md:w-[50%] sm:w-[100%]">
						<PortableText
							value={data?.titleText.titleWithText?.text}
						/>
					</div>
				</div>
			</div>
			<div className="max-w-[1220px] mx-auto md:py-16 pt-10 xl:px-0 px-5">
				<h2 className="xl:text-[96px] lg:text-[80px] md:text-[60px] md:mb-10 mb-2 text-[40px] text-[var(--alembic-black)] xl:leading-[92px] lg:leading-[92px] font-semibold leading-[45px] ">
					{data?.foundingTeam?.sectionTitle}
				</h2>
				<div className="flex flex-wrap gap-3">
					{data?.foundingTeam?.teamMembers?.map(
						(member: SanityDocument) => (
							<div
								className="md:flex-1 w-[100%]"
								key={member._key}
							>
								<Link href={member?.linkedIn} target="_blank">
									<Image
										src={urlFor(member.image)?.url() ?? ""}
										alt=""
										width={450}
										height={450}
										className="w-full h-450"
									></Image>
									<p className="text-[24px] mt-7">
										<span className="font-bold">
											{member.name}
										</span>
										<br />
										{member.designation}
									</p>
								</Link>
							</div>
						)
					)}
				</div>
			</div>

			{/* Subscribe Form */}
			<SubscribeForm />
			{/* Subscribe Form */}

			<div className="max-w-[1220px] mx-auto xl:px-0 px-5 py-10">
				<h3 className="xl:text-[96px] lg:text-[80px] md:text-[60px] text-[40px] text-[var(--alembic-black)] xl:leading-[92px] lg:leading-[92px] leading-[45px] ">
					Featured news <br />
					and press
				</h3>
				<ThreeColumnNews />
			</div>
		</div>
	);
}
