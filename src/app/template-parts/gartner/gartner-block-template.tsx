"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../../utility-functions";

type GartnerBlock = {
	title: string;
	url: string;
	ctaText: string;
	logo: {
		_type: "image";
		asset: {
			_type: "reference";
			_ref: string;
		};
	};
};

type Props = {
	data: GartnerBlock;
};
export default function GartnerBlockTemplate({ data }: Props) {
	if (!data) {
		return null;
	}

	const { title, url, ctaText, logo } = data;

	const imageUrl = urlFor(logo)?.fit("max").url() ?? "";

	return (
		<div className="bg-[#001BCB] max-w-[1220px] min-h-[483px] mx-auto pl-[32px] pr-[32px] py-[48px]">
			<h3 className="xl:text-[60px] lg:text-[50px] md:text-[40px] text-[30px] text-white font-normal xl:leading-[70px] lg:leading-[65px] md:leading-[55px] sm:leading-[45px] leading-[40px] tracking-[-2px] mb-8">
				{title}
			</h3>
			<div className="flex justify-between md:flex-nowrap gap-3 flex-wrap">
				<Link
					href={url || "#"}
					className="architekt text-[#001BCB] bg-white text-center px-[32px] py-[16px]"
				>
					{ctaText} &gt;
				</Link>
				<Image
					src={imageUrl}
					alt="Gartner logo"
					width={200}
					height={50}
					className="md:pt-0 pt-4"
				/>
			</div>
		</div>
	);
}
