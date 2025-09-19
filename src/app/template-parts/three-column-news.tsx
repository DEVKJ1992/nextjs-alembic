import Image from "next/image";
import Link from "next/link";
import { getData, urlFor, NewsItem } from "../utility-functions";

const query = `*[
    _type == "news" && !(_id in path("drafts.**"))
  ]|order(publishedAt desc)[0...3]{
    _id,
    title,
    image,
    logo,
    publishedAt,
    cta
  }`;

export default async function threeColumnNews() {
	const news = await getData(query, "Three Column News");

	return (
		<div className="container mx-auto py-12">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{news?.map((newsItem: NewsItem) => (
					<div key={newsItem._id}>
						<Link href={`${newsItem.cta}`} target="_blank">
							<div className="bg-white overflow-hidden">
								{newsItem.image && (
									<Image
										src={
											urlFor(newsItem.image)?.width(600).height(600).url() ?? ""
										}
										width="600"
										height="600"
										alt={newsItem.title}
										className="w-full object-cover"
									/>
								)}
								{newsItem.logo && (
									<Image
										src={urlFor(newsItem.logo)?.fit("max").url() ?? ""}
										width="150"
										height="60"
										alt={newsItem.title}
										className="max-h-[40px] object-contain mt-5"
									/>
								)}
								<div className="pt-6">
									<h3 className="text-large p-0 mt-[-10px]">
										{newsItem.title}
									</h3>
								</div>
							</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
