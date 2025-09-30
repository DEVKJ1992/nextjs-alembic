import Link from "next/link";
import Image from "next/image";
import { PortableText, type SanityDocument } from "next-sanity";
import { getData, urlFor, IconWithText, Logo } from "../utility-functions";
import ThreeColumnNews from "../template-parts/three-column-news";
import FooterSection from "../template-parts/footer-section";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { SITE_URL } from "../constants/site";

const query = `*[_type == "companyPage"][0]{_id, seo}`;
const options = { next: { revalidate: 3600 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/company`;
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

export default async function CompanyPage() {
	const data = await getData(`*[_type == "companyPage"][0]`, "Company Page");

	return (
		<div className="Company-parent">
			<div className="xl:p-10 lg:p-10 md:p-8 p-5 max-w-[1280px] m-auto">
				<h1 className="mb-6 mt-4">{data?.pageTitle}</h1>
				<div className="max-w-[575px] ml-auto text-[var(--alembic-black)] text-[16px]">
					<PortableText value={data?.body} />
				</div>
			</div>
			<div className="company_grid bg-[#F5FAFF] py-20">
				<div className=" xl:px-0 px-5  max-w-[1280px]  mx-auto">
					<div className="border-b-2 border-[var(--alembic-black)]">
						<h2 className="font-semibold xl:text-[92px] lg:text-[80px] md:text-[60px] xl:leading-[96px] lg:leading-[96px] md:leading-[60px]">
							{data?.valuesTitle}
						</h2>
						<div className="max-w-[570px] my-5 ml-auto">
							<PortableText value={data?.valuesBody} />
						</div>
					</div>

					<div className="flex flex-wrap gap-5 justify-between mt-10">
						{data?.values?.map((value: IconWithText) => (
							<div
								className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col gap-5 md:py-5"
								key={value._key}
							>
								<Image
									src={urlFor(value.icon)?.url() ?? ""}
									alt=""
									width={32}
									height={32}
								></Image>
								<h3 className="md:text-[32px] text-[26px] leading-[32px] font-medium p-0">
									{value.title}
								</h3>
								<p>{value.text}</p>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="py-20">
				<div className="bg-[var(--alembic-purple)] p-10 max-w-[1220px]  mx-auto">
					<h3 className="text-[#fff] lg:text-[64px] lg:leading-[70px] font-normal">
						{data?.ctaTitle}
					</h3>

					<Link
						href="/careers"
						className="p-[16px] text-[#001BCB] text-[14px] bg-[#fff] text-[var(--alembic-purple)] tracking-[1.4px] flex justify-center w-max my-12 architekt"
					>
						GO TO CAREERS &gt;
					</Link>
					<p className="text-[#fff] text-[24px]">
						Learn about the history of Alembic,{" "}
						<Link href="/created-in-california">
							<span className="text-[var(--alembic-black)]">
								Created in California
							</span>
						</Link>
					</p>
				</div>
			</div>
			<div className="px-8">
				<div className="max-w-[1220px] mx-auto py-10">
					<h2 className="text-black md:text-[48px] text-[42px] text-center font-semibold">
						{data?.logosTitle}
					</h2>
					<div className="flex flex-wrap md:flex-row flex-col content-center md:gap-12 gap-20 justify-center py-10">
						{data?.logos?.map((logo: Logo) => (
							<div
								className="max-w-[200px] max-h-[90px]"
								key={logo._key}
							>
								<Image
									src={urlFor(logo.logo)?.url() ?? ""}
									alt={logo.logo.alt ?? ""}
									width={200}
									height={100}
									className="max-h-[150px] w-full h-full"
								></Image>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="py-10 px-8">
				<div className="max-w-[1220px]  mx-auto">
					<h3 className="color-[var(--alembic-black)] text-[48px] font-medium">
						Featured news and press
					</h3>
					<ThreeColumnNews />
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
