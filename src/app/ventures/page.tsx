import Image from "next/image";
import { PortableText, type SanityDocument } from "next-sanity";
import { getData, urlFor, IconWithText } from "../utility-functions";
// import FooterSection from "../template-parts/footer-section";
import Button from "../components/Button";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { SITE_URL } from "../constants/site";

const query = `*[_type == "venturesPage"][0]{_id, seo}`;
const options = { next: { revalidate: 86400 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/ventures`;
		return {
			title: page.seo?.metaTitle
				? page.seo?.metaTitle + " | Alembic"
				: "Alembic Ventures | Alembic",
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

export default async function VenturesPage() {
	const data = await getData(
		`*[_type == "venturesPage"][0]`,
		"Ventures Page",
	);

	return (
		<div className="Ventures-parent">
			<div className="xl:p-10 p-5 max-w-[1280px] m-auto">
				<h1 className="mb-6 mt-4 pt-4 text-[48px] sm:text-[120px]">
					Alembic Ventures
				</h1>
				<h3
					className="mb-6 mt-4"
					dangerouslySetInnerHTML={{ __html: data?.pageTitle ?? "" }}
				/>
				<div className="max-w-[575px] ml-auto text-[var(--alembic-black)] text-[16px]">
					<PortableText value={data?.body} />
				</div>
			</div>
			<div className="company_grid bg-[#F5FAFF] py-20">
				<div className="xl:px-10 px-5 max-w-[1280px]  mx-auto">
					<div className="border-b-2 border-[var(--alembic-black)]">
						<h2 className="font-semibold xl:text-[92px] lg:text-[80px] md:text-[60px] xl:leading-[96px] lg:leading-[96px] md:leading-[60px]">
							{data?.wwwwTitle}
						</h2>
						<div className="max-w-[570px] my-5 ml-auto">
							<PortableText value={data?.wwwwBody} />
						</div>
					</div>

					<div className="flex flex-wrap gap-5 justify-between mt-10">
						{data?.wwww?.map((wwww: IconWithText) => (
							<div
								className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 md:py-5"
								key={wwww._key}
							>
								<Image
									src={urlFor(wwww.icon)?.url() ?? ""}
									alt=""
									width={50}
									height={33}
								></Image>
								<h3 className="md:text-[32px] text-[26px] leading-[32px] font-medium p-0">
									{wwww.title}
								</h3>
								<p>{wwww.text}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* alembic testimonial */}
			<div
				className={`data-operation py-20 bg-[right_center] bg-no-repeat bg-cover ${data?.testimonial?.solidBackground ? "force-mobile-bg" : ""}`}
				style={{
					backgroundImage:
						"url(" +
						(urlFor(data?.testimonial?.bgImage)?.url() ?? "") +
						")",
				}}
			>
				<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
					<h2 className="max-w-[847px] md:text-[48px] text-[28px] font-semibold lg:leading-[60px] leading-[35px] mx-auto">
						{data?.testimonial?.sectionTitle}
					</h2>
					<div className="flex flex-wrap gap-5 justify-between md:mt-20 mt-5">
						<div className="xl:w-[35%] lg:w-[32%] w-[100%]">
							<Image
								src={
									urlFor(data?.testimonial?.photo)?.url() ??
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
								{data?.testimonial?.text}
							</p>
							<div className="auth flex xl:flex-row flex-col gap-3 justify-between xl:items-end items-start">
								<div className="auth-data flex flex-col">
									{data?.testimoial?.name && (
										<p className="font-semibold py-1">
											{data?.testimonial?.name}
										</p>
									)}
									{data?.testimoial?.designation && (
										<p className="pb-5">
											{data?.testimonial?.designation}
										</p>
									)}
									{data?.testimoial?.bottomText && (
										<span className="w-full md:w-max architekt py-1 text-[#8B71F6]">
											{data?.testimonial?.bottomText}
										</span>
									)}
								</div>
								{data?.testimonial?.ctaText && (
									<div className="btn-box">
										<Button
											href={data?.testimonial?.ctaUrl}
											variant="primary"
											className="ml-auto"
										>
											{data?.testimonial?.ctaText}
										</Button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* alembic testimonial */}

			{/* {data?.footer && (
				<FooterSection
					title={data.footer.title}
					body={data.footer.text}
					ctaText={data.footer.buttonText}
					ctaUrl={data.footer.buttonURL}
				/>
			)} */}
		</div>
	);
}
