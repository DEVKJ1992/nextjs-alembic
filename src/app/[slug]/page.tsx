import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
	projectId && dataset
		? imageUrlBuilder({ projectId, dataset }).image(source)
		: null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const post = await client.fetch<SanityDocument>(
		POST_QUERY,
		await params,
		options
	);
	const postImageUrl = post.image
		? urlFor(post.image)?.width(550).height(310).url()
		: null;

	return (
		<main className="container mx-auto min-h-screen max-w-5xl p-8 flex flex-col gap-4">
			<Link href="/" className="hover:underline">
				← Back to posts
			</Link>
			{postImageUrl && (
				<img
					src={postImageUrl}
					alt={post.title}
					className="aspect-video rounded-xl"
					width="550"
					height="310"
				/>
			)}
			<h4 className="text-xl text-center font-bold my-8">
				<span className="text-red-600">AUTHOR</span> -{" "}
				{post.author ? post.author : "Gregory Kennedy"}
			</h4>
			<h1 className="text-2xl font-bold mb-8">{post.title}</h1>
			<div className="prose">
				<p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
				{Array.isArray(post.body) && <PortableText value={post.body} />}
			</div>
			<Link
				href={post.cta ? post.cta : "/book-a-demo"}
				className="my-5 text-center font-bold hover:underline"
			>
				BOOK DEMO
			</Link>
		</main>
	);
}
