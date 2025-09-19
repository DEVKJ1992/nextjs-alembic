import Image from "next/image";
import Link from "next/link";
import { getData, urlFor } from "../utility-functions";
import { type SanityDocument } from "next-sanity";

const query = `*[
	_type == "post"
	&& defined(slug.current) && !(_id in path("drafts.**"))
  ]|order(publishedAt desc)[0...3]{_id, title, slug, image, publishedAt, author}`;

export default async function threeColumnBlog() {
	const posts = await getData(query, "Three Column Posts");

	return (
		<div className="max-w-[1220px] mx-auto xl:px-0 px-5 py-10">
			<h3 className="xl:text-[96px] lg:text-[80px] md:text-[60px] text-[var(--alembic-black)] xl:leading-[92px] lg:leading-[92px]">
				Discover more <br /> on our blog
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
				{posts?.map((post: SanityDocument) => (
					<div key={post._id}>
						<Link href={`/${post.slug.current}`}>
							<div className="bg-white overflow-hidden">
								{post.image && (
									<Image
										src={urlFor(post.image)?.width(600).height(600).url() ?? ""}
										width="600"
										height="600"
										alt={post.title}
										className="w-full h-80 object-cover"
									/>
								)}
								<div className="pt-6">
									<p className="text-sm text-gray-600 p-0">
										{new Date(post.publishedAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
									<h3 className="text-large p-0 pt-2">{post.title}</h3>
								</div>
							</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
