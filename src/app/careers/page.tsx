import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";
import ThreeColumnNews from "../template-parts/three-column-news";
import { getData } from "../utility-functions";
import { PortableText, type SanityDocument } from "next-sanity";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { SITE_URL } from "../constants/site";
import Button from "../components/Button";

const query = `*[_type == "careersPage"][0]{_id, seo}`;
const options = { next: { revalidate: 3600 } };

export async function generateMetadata(): Promise<Metadata> {
	let page: SanityDocument | null = null;

	try {
		page = await client.fetch<SanityDocument>(query, {}, options);
		const canonicalUrl = `${SITE_URL}/careers`;
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

async function getJobs() {
	const apiKey = process.env.ASHBY_API_KEY; // Store your API key in .env.local
	const response = await fetch(
		"https://api.ashbyhq.com/posting-api/job-board/alembic",
		{
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		}
	);

	if (!response.ok) {
		console.error("Failed to fetch jobs:", response.statusText);
		return [];
	}

	const data = await response.json();
	return data.jobs;
}

type Job = {
	id: string;
	title: string;
	location: string;
	department: string;
	isRemote: boolean;
	employmentType: string;
	jobUrl: string;
};

function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

export default async function JobsPage() {
	const jobs: Job[] = await getJobs();
	const data = await getData(`*[_type == "careersPage"][0]`, "Careers Page");
	return (
		<div className="xl:p-10 p-5 max-w-[1280px] m-auto">
			<h1 className="mb-6 mt-4">{data?.pageTitle}</h1>
			<div className="max-w-[575px] ml-auto text-[var(--alembic-black)] text-[16px]">
				<PortableText value={data?.body} />
			</div>

			<div className="flex gap-2 flex-row xl:mt-20 lg:mt-20 md:mt-15 mt-5 flex-wrap">
				<div className="left-col xl:flex-1 lg:flex-1 md:flex-1">
					<h2 className="text-[var(--alembic-black)] text-[30px] xl:text-[64px] lg:text-[64px] md:text-[50px] leading-[50px] font-bold md:mt-2 md:mb-6 p-0">
						{data?.openPositions?.title}
					</h2>
					<p className="max-w-[575px] text-[var(--alembic-black)] text-[16px] leading-[24px]">
						{data?.openPositions?.text}
					</p>
				</div>
				<div className="space-y-4 xl:flex-1 lg:flex-1 md:flex-1">
					{jobs?.map((job, index) => (
						<div
							key={job.id}
							className={`md:p-4 p-0 relative ${
								index === 0 ? "!pt-0" : "border-t !mt-5"
							}`}
						>
							<div className="flex md:flex-row flex-col-reverse justify-between md:items-center items-start md:mt-0 mt-5 gap-2">
								<h3 className="text-[var(--alembic-black)] xl:text-[24px] md:text-[21px] text-[18px] font-semibold p-0">
									{job.title}
								</h3>
								<span className="py-2 px-3 text-[12px] bg-purple-100 font-medium text-purple-600 rounded-3xl">
									{job.department}
								</span>
							</div>
							<p className="text-gray-600 text-[14px]">
								{job.location}
							</p>
							<span className="mr-4">
								<FontAwesomeIcon
									icon={faLocationDot}
									className="fab fa-location-dot mr-2"
								></FontAwesomeIcon>
								{job.isRemote ? "Remote" : "In Person"}
							</span>{" "}
							<span>
								<FontAwesomeIcon
									icon={faClock}
									className="fab fa-clock mr-2"
								></FontAwesomeIcon>
								{job.employmentType == "FullTime"
									? "Full Time"
									: job.employmentType}
							</span>
							<br />
							{isValidUrl(job.jobUrl) ? (
								<Button
									href={job.jobUrl}
									variant="primary"
									className="mt-5 !px-6 !h-[42px]"
									externalLink
									noIcon
								>
									Apply Now
								</Button>
							) : (
								<span className="mt-2 inline-block bg-gray-300 text-gray-600 px-4 py-2 rounded">
									Application link unavailable
								</span>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="py-10">
				<div className="max-w-[1220px] mx-auto">
					<h2 className="color-[var(--alembic-black)] text-[48px] font-medium">
						Featured news and press
					</h2>
					<ThreeColumnNews />
				</div>
			</div>
		</div>
	);
}
