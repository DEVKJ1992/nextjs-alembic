import { PortableText, type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { Metadata } from "next";
import { urlFor, components, getData } from "../utility-functions";
import Image from "next/image";
import FooterSection from "../template-parts/footer-section";
import { SITE_URL } from "../constants/site";
import { notFound } from "next/navigation";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
const options = { next: { revalidate: 86400 } };

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const post = await client.fetch<SanityDocument>(
		POST_QUERY,
		await params,
		options,
	);

	const canonicalUrl = `${SITE_URL}/${(await params).slug}`;

	const title = post.metaTitle
		? post?.metaTitle + " | Alembic" ||
			"Causal AI Platform & Private Intelligence Solution | Alembic"
		: post.shortTitle
			? post?.shortTitle + " | Alembic"
			: "Blog | Alembic";

	const description = post.metaDescription
		? post?.metaDescription ||
			"Alembic is the Causal AI decision-making platform that reveals what truly drives growth and business outcomes. Combining applied science, private supercomputing infrastructure, and the scale required by Fortune 500 and Global 2000 enterprises."
		: "contact us for more information";

	const metaImage = urlFor(post?.metaImage)?.url() ?? "";

	return {
		title: {
			default: title,
			template: `%s`,
		},
		description: description,
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			title,
			description,
			url: canonicalUrl,
			siteName: "Alembic",
			images: [
				{
					url: metaImage,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
			type: "article",
		},
		twitter: {
			title,
			description,
			card: "summary_large_image",
			images: [metaImage],
		},
	};
}

export default async function PostPage({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const sp = await searchParams;
	const isDraftMode: boolean =
		sp.preview !== null ? sp.preview === "true" : false;
	const post = await getData(
		POST_QUERY,
		"Post Page",
		await params,
		isDraftMode,
	);

	if (!post) {
		notFound();
	}

	const postImageUrl = post?.image
		? urlFor(post?.image)?.fit("max").url()
		: null;

	return (
		<main>
			<div className="container mx-auto min-h-screen p-8 flex flex-col gap-4 blog-post">
				{postImageUrl && (
					<Image
						src={postImageUrl}
						alt={post?.title}
						className="aspect-video md:h-[450px]"
						width={0}
						height={0}
						sizes="100vw"
						style={{ width: "100%", objectFit: "cover" }}
					/>
				)}
				<h4 className="text-md text-[var(--alembic-black)] my-4">
					{/* <span className="text-[var(--alembic-black)]">AUTHOR</span>-{" "}
					{post?.author ? post.author : "Gregory Kennedy"} */}
				</h4>
				<div className="max-w-[730px] mx-auto">
					<h1 className="md:text-[64px] text-[36px] md:leading-[70px] leading-[40px] tracking-[-2px] font-normal mb-8">
						{post?.title}
					</h1>
					<div className="prose">
						<p suppressHydrationWarning>
							Published:{" "}
							{new Date(post?.publishedAt).toLocaleDateString()}
						</p>
						{Array.isArray(post?.body) && (
							<PortableText
								value={post?.body}
								components={components}
							/>
						)}
					</div>

					<div className="bg-[var(--alembic-purple)] p-10">
						<h3 className="text-[#fff] text-[32px] leading-[40px]">
							See how your campaigns are driving revenue growth
							with Alembic
						</h3>
						<p className="text-[#fff]]">
							CMOs who focus on collecting and analyzing in-depth
							customer engagement metrics will be the ones to lead
							their brands to sustained growth. Discover how
							Alembic can help you track and interpret meaningful
							customer engagement metrics and drive business
							success. Book a demo with Alembic and harness the
							power of data-driven intelligence to achieve your
							2026 goals and beyond.
						</p>
						<Link
							href="/book-a-consultation"
							className="btn-al bg-[#fff] text-[var(--alembic-purple)] ml-auto flex justify-center max-w-64 mt-12"
						>
							BOOK A DEMO &gt;
						</Link>
					</div>
				</div>
			</div>
			<FooterSection
				title={"Maximize marketing's revenue impact with Alembic"}
				body={
					"Talk to our team and learn how Alembic’s Marketing Intelligence Platform can help you find the insights that matter."
				}
				ctaText={"LET'S GET STARTED"}
				ctaUrl={"/book-a-consultation"}
			/>
		</main>
	);
}
