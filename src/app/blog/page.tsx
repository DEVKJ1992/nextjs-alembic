import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import Image from "next/image";
import { getData, urlFor } from "../utility-functions";
import GartnerBlock from "../template-parts/gartner/gartner-block";
import ThreeColumnNews from "../template-parts/three-column-news";

import { client } from "@/sanity/client";
import FooterSection from "../template-parts/footer-section";
import SubscribeForm from "../template-parts/subscribe/subscribe-form";
import { Metadata } from "next";
import { SITE_URL } from "../constants/site";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current) && !(_id in path("drafts.**"))
]|order(publishedAt desc)[$start...$end]{_id, title, slug, image, publishedAt, author, category}`;

const options = { next: { revalidate: 3600 } };
const POSTS_PER_PAGE = 10;

const query = `*[_type == "blogPage"][0]{_id, seo}`;

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/blog`;
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

export default async function PostIndexPage(props: {
	searchParams: Promise<{ page?: string }>;
}) {
	const searchParams = await props.searchParams;
	const currentPage = Number(searchParams?.page) || 1;
	const start = (currentPage - 1) * POSTS_PER_PAGE;
	const end = start + POSTS_PER_PAGE;
	const data = await getData(`*[_type == "blogPage"][0]`, "Blog Page");
	const posts = await client.fetch<SanityDocument[]>(
		POSTS_QUERY,
		{ start, end },
		options
	);

	const totalPosts = await client.fetch<number>(
		`count(*[_type == "post" && defined(slug.current)])`
	);
	const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

	return (
		<main>
			<div className="container max-w-[1250px] mx-auto min-h-screen p-8">
				<h1 className="mb-8 mt-4 max-w-[900px]">{data?.pageTitle}</h1>

				<Link href={`/${posts[0]?.slug?.current}`}>
					<div
						key={posts[0]?._id}
						className="relative h-[500px] bg-cover bg-center"
						style={{
							backgroundImage: `url(${urlFor(posts[0]?.image)?.width(1200).height(500).url() ?? "/images/featured-article.png"})`,
						}}
					>
						<div className="absolute bottom-4 right-4 bg-white p-6 max-w-[780px] shadow-lg">
							<p className="architekt text-sm text-[var(--alembic-purple)] rounded-[40px] border-[1px] border-[solid] border-[alembic-purple] max-w-[270px] px-[16px] py-[6px]">
								THIS MONTHS FEATURED ARTICLE
							</p>
							<h2 className="mt-2">{posts[0]?.title}</h2>
							{/* <p className="text-gray-700 mt-4">
							We’ve made updates to the Model Spec based on external feedback
							and our continued research in shaping desired model behavior.
						</p> */}
						</div>
					</div>
				</Link>
				<div className="container mx-auto py-12">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{posts?.map(
							(post, index) =>
								index !== 0 &&
								index <= 3 && (
									<div key={post._id}>
										<Link href={`/${post.slug.current}`}>
											<div className="bg-white overflow-hidden">
												<Image
													src={
														urlFor(post.image)
															?.width(600)
															.height(600)
															.url() ?? ""
													}
													width="600"
													height="600"
													alt={post.title}
													className="w-full h-80 object-cover"
												/>
												<div className="pt-6">
													<p className="text-sm text-gray-600 p-0">
														{/* {post.author},{" "} */}
														{new Date(
															post.publishedAt
														).toLocaleDateString()}
													</p>
													<h3 className="text-large p-0 pt-2">
														{post.title}
													</h3>
												</div>
											</div>
										</Link>
									</div>
								)
						)}
					</div>
				</div>

				<GartnerBlock />

				<div className="container mx-auto py-12">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{posts?.map(
							(post, index) =>
								index > 3 && (
									<div key={post._id}>
										<Link href={`/${post.slug.current}`}>
											<div className="bg-white overflow-hidden">
												<Image
													src={
														urlFor(post.image)
															?.width(600)
															.height(600)
															.url() ?? ""
													}
													width="600"
													height="600"
													alt={post.title}
													className="w-full h-80 object-cover"
												/>
												<div className="pt-6">
													<p className="text-sm text-gray-600 p-0">
														{/* {post.author},{" "} */}
														{new Date(
															post.publishedAt
														).toLocaleDateString()}
													</p>
													<h3 className="text-large font-bold p-0 pt-2">
														{post.title}
													</h3>
												</div>
											</div>
										</Link>
									</div>
								)
						)}
					</div>
				</div>

				<div className="flex justify-center gap-2 mt-8">
					{Array.from({ length: totalPages }, (_, i) => (
						<Link
							key={i + 1}
							href={`/blog?page=${i + 1}`}
							className={`text-[20px] px-5 py-2 rounded-full text-[var(--alembic-black)] ${currentPage === i + 1 ? "border-2 border-solid border-[var(--alembic-black)]" : ""}`}
						>
							{i + 1}
						</Link>
					))}
				</div>

				<SubscribeForm />

				<h3 className="mb-8 text-[var(--alembic-black)] font-[Inter] xl:text-[48px] lg:text-[48px] md:text-[40px] sm:text-[40px] not-italic font-semibold">
					Featured news & press
				</h3>
				<ThreeColumnNews />
			</div>
			{data?.footer && (
				<FooterSection
					title={data.footer.title}
					body={data.footer.text}
					ctaText={data.footer.buttonText}
					ctaUrl={data.footer.buttonURL}
				/>
			)}
		</main>
	);
}
