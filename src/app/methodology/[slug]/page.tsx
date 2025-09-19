import { PortableText, type SanityDocument } from "next-sanity";
import { getData, components } from "../../utility-functions";
import { Metadata } from "next";
import FooterSection from "../../template-parts/footer-section";
import { client } from "@/sanity/client";

const query = `*[_type == "basicPages" && slug.current == $slug][0]`;
const options = { next: { revalidate: 3600 } };

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, await params, options);
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
		};
	} catch (error) {
		console.error("Failed to fetch page data", error);
		return {
			title: "Alembic",
			description: "Contact us for more information",
		};
	}
}

export default async function BasicPage({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const sp = await searchParams;
	const isDraftMode: boolean =
		sp.preview !== null ? sp.preview === "true" : false;
	const data = await getData(query, "Post Page", await params, isDraftMode);

	return (
		<div className="pt-20">
			<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
				<div className="max-w-[700px] mb-10">
					<h1>{data?.pageTitle}</h1>
				</div>
				<div className="max-w-[700px] m-auto">
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
