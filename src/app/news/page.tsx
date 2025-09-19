import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import Image from "next/image";
import { getData, urlFor } from "../utility-functions";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import FooterSection from "../template-parts/footer-section";
import { headers } from "next/headers";
import Button from "../components/Button";

const NEWS_QUERY = `*[
  _type == "news" && !(_id in path("drafts.**"))
]|order(publishedAt desc)[$start...$end]{_id, title, image, publishedAt, logo, cta}`;

const PRESS_QUERY = `*[
  _type == "press" && !(_id in path("drafts.**"))
]|order(publishedAt desc){_id, title, publishedAt, cta}`;

const options = { next: { revalidate: 600 } };
const POSTS_PER_PAGE = 5;

const query = `*[_type == "newsPage"][0]{_id, seo}`;

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const headersList = await headers();
		const host = headersList.get("host");
		const protocol = headersList.get("x-forwarded-proto") || "https";
		const canonicalUrl = `${protocol}://${host}/news`;
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

export default async function NewsIndexPage(props: {
	searchParams: Promise<{ page?: string }>;
}) {
	const searchParams = await props.searchParams;
	const currentPage = Number(searchParams?.page) || 1;
	const start = (currentPage - 1) * POSTS_PER_PAGE;
	const end = start + POSTS_PER_PAGE;
	const data = await getData(
		`*[_type == "newsPage"][0]{..., "logosUrl": pressContact.UploadLogos.asset->url, "photosUrl": pressContact.UploadPhotos.asset->url}`,
		"News Page"
	);

	const news = await client.fetch<SanityDocument[]>(
		NEWS_QUERY,
		{ start, end },
		options
	);

	const press = await client.fetch<SanityDocument[]>(
		PRESS_QUERY,
		{},
		options
	);

	const totalPosts = await client.fetch<number>(`count(*[_type == "news"])`);
	const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

	return (
		<main>
			<div className="max-w-[1220px] mx-auto md:py-20 py-10 xl:px-0 px-5">
				<h1 className="font-light xl:text-[64px] lg:text-[60px] md:text-[50px] text-[40px] xl:leading-[70px] lg:leading-[70px] leading-[45px]">
					{data?.pageTitle}
				</h1>
			</div>
			<div className="max-w-[1220px] mx-auto xl:px-0 px-5 py-5">
				<h3 className="xl:text-[96px] lg:text-[80px] md:text-[60px] text-[40px] text-[#050A24] xl:leading-[92px] lg:leading-[92px] leading-[45px]">
					Top Alembic news
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:mt-10 mt-2">
					{news.map(
						(newsItem, index) =>
							index <= 1 && (
								<div key={newsItem._id}>
									<Link
										href={`${newsItem.cta}`}
										target="_blank"
									>
										<div className="bg-white overflow-hidden">
											{newsItem.image && (
												<Image
													src={
														newsItem.image
															? (urlFor(
																	newsItem.image
																)
																	?.width(600)
																	.height(600)
																	.url() ??
																"/images/news-placeholder.png")
															: "/images/news-placeholder.png"
													}
													width="600"
													height="800"
													alt={newsItem.title}
													className="w-full h-85 object-cover"
												/>
											)}
											<div className="pt-6">
												{newsItem.logo && (
													<Image
														src={
															urlFor(
																newsItem.logo
															)
																?.fit("max")
																.url() ?? ""
														}
														width="150"
														height="70"
														alt={newsItem.title}
														className="max-h-[50px] object-contain"
													/>
												)}
												<h3 className="text-large p-0 pt-2">
													{newsItem.title}
												</h3>
											</div>
										</div>
									</Link>
								</div>
							)
					)}
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:mt-10 mt-2">
					{news.map(
						(newsItem, index) =>
							index > 1 && (
								<div key={newsItem._id}>
									<Link
										href={`${newsItem.cta}`}
										target="_blank"
									>
										<div className="bg-white overflow-hidden">
											<Image
												src={
													newsItem.image
														? (urlFor(
																newsItem.image
															)
																?.width(600)
																.height(600)
																.url() ??
															"/images/news-placeholder.png")
														: "/images/news-placeholder.png"
												}
												width="600"
												height="600"
												alt={newsItem.title}
												className="w-full h-80 object-cover"
											/>
											<div className="pt-6">
												{newsItem.logo && (
													<Image
														src={
															urlFor(
																newsItem.logo
															)
																?.fit("max")
																.url() ?? ""
														}
														width="150"
														height="50"
														alt={newsItem.title}
														className="max-h-[30px] object-contain"
													/>
												)}

												<h3 className="text-large p-0 pt-2">
													{newsItem.title}
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
				{/* Previous Button */}
				{currentPage > 1 && (
					<Link
						href={`/news?page=${currentPage - 1}`}
						className="text-[20px] px-4 py-2 rounded-full text-[var(--alembic-black)] hover:bg-gray-200"
					>
						&lt;
					</Link>
				)}

				{/* Page Numbers */}
				{Array.from({ length: totalPages }, (_, i) => {
					const pageNumber = i + 1;

					// Show only the first 2 pages, current page, and last 2 pages on mobile
					if (
						pageNumber === 1 ||
						pageNumber === 2 ||
						pageNumber === currentPage ||
						pageNumber === totalPages - 1 ||
						pageNumber === totalPages
					) {
						return (
							<Link
								key={pageNumber}
								href={`/news?page=${pageNumber}`}
								className={`text-[20px] px-4 py-2 rounded-full text-[var(--alembic-black)] ${currentPage === pageNumber ? "border-2 border-solid border-[var(--alembic-black)]" : "hover:bg-gray-200"}`}
							>
								{pageNumber}
							</Link>
						);
					}

					// Show ellipsis for hidden pages
					if (
						(pageNumber === 3 && currentPage > 4) ||
						(pageNumber === totalPages - 2 &&
							currentPage < totalPages - 3)
					) {
						return (
							<span
								key={pageNumber}
								className="text-[20px] px-4 py-2"
							>
								...
							</span>
						);
					}

					return null;
				})}

				{/* Next Button */}
				{currentPage < totalPages && (
					<Link
						href={`/news?page=${currentPage + 1}`}
						className="text-[20px] px-4 py-2 rounded-full text-[var(--alembic-black)] hover:bg-gray-200"
					>
						&gt;
					</Link>
				)}
			</div>

			<div
				id="press-inquiry"
				className="max-w-[1220px] mx-auto xl:px-0 px-5 py-5"
			>
				<h2>{data?.pressRelease?.title}</h2>
				<p className="md:max-w-[50%] max-w-[100%]">
					{data?.pressRelease?.text}
				</p>
				<div className="flex flex-wrap gap-5 py-5">
					<div className="flex-1 bg-[var(--alembic-purple)] p-8 min-h-[310px] ">
						<h4 className="md:text-[32px] text-[24px] font-semibold text-white">
							Press contact
						</h4>
						<span className="text-[16px] font-medium block text-white mt-5">
							{data?.pressContact?.contactName}
						</span>
						<span className="text-[16px] font-medium block text-white">
							{data?.pressContact?.contactEmail}
						</span>
						<h4 className="md:text-[32px] text-[24px] font-semibold text-white mt-5">
							Download press material
						</h4>
						<div className="flex md:flex-row flex-col gap-3 mt-5">
							<a
								href={`${data?.logosUrl}?dl=`}
								download
								className="architekt md:flex-1 bg-white hover:bg-black text-[#001BCB] hover:text-white flex justify-center items-center min-h-[53px]"
							>
								DOWNLOAD LOGOS &gt;
							</a>
							<a
								href={`${data?.photosUrl}?dl=`}
								download
								className="architekt md:flex-1 bg-white hover:bg-black text-[#001BCB] hover:text-white flex justify-center items-center min-h-[53px]"
							>
								HI-RES PHOTOS &gt;
							</a>
						</div>
					</div>
					<div className="flex-1 border-t-2 border-gray-100 py-5">
						<span className="text-[18px] font-light block text-[var(--alembic-black)] mt-5">
							{new Date(press[0].publishedAt).toLocaleDateString(
								"en-US",
								{
									year: "numeric",
									month: "long",
									day: "numeric",
								}
							)}
						</span>
						<h3 className="font-semibold text-[32px] leading-[40px]">
							{press[0].title}
						</h3>
						<Button
							href={press[0].cta}
							variant="secondary"
							className="px-12 mt-5"
							externalLink
							noIcon
						>
							SEE PRESS RELEASE &gt;
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-5">
					{press.map(
						(pressItem, index) =>
							index > 0 && (
								<div
									className="border-t-2 border-gray-100 py-5"
									key={pressItem._id}
								>
									<span className="text-[18px] font-light block text-[var(--alembic-black)] mt-5">
										{new Date(
											pressItem.publishedAt
										).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</span>
									<h3 className="font-semibold text-[32px] leading-[40px]">
										{pressItem.title}
									</h3>
									<Button
										href={pressItem.cta}
										variant="secondary"
										className="px-12 mt-5"
										externalLink
										noIcon
									>
										SEE PRESS RELEASE &gt;
									</Button>
								</div>
							)
					)}
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
		</main>
	);
}
