import Image from "next/image";
import { PortableText, type SanityDocument } from "next-sanity";
import { urlFor } from "../utility-functions";
import Button from "../components/Button";

export default function ContentImage(props: {
	title: string;
	body: SanityDocument;
	image: SanityDocument;
	ctaText?: string;
	ctaUrl?: string;
}) {
	return (
		<div className="max-w-[1220px] mx-auto py-16 xl:px-0 px-5">
			<h2 className="xl:text-[96px] lg:text-[80px] md:text-[60px] text-[40px] text-[var(--alembic-black)] xl:leading-[92px] lg:leading-[92px] font-semibold md:leading-[60px] leading-[45px] z-10 relative">
				{props.title}
			</h2>
			<div className="font-medium md:max-w-[50%] md:mt-5 mt-0">
				<PortableText value={props.body} />
			</div>
			{props.ctaText && (
				<Button
					href={props.ctaUrl}
					variant="primary"
					className="flex-1 mt-5"
				>
					{props.ctaText}
				</Button>
			)}
			<Image
				src={urlFor(props.image)?.url() ?? ""}
				alt={props.title}
				width={1000}
				height={500}
				className="ml-auto xl:mr-[-15vw] md:w-[80%] w-[100%] mt-5"
			></Image>
		</div>
	);
}
