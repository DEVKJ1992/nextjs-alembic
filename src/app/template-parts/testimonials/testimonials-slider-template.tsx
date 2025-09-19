"use client";

import React from "react";
import { MouseEventHandler } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { urlFor } from "../../utility-functions";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface Testimonial {
	_key: string;
	name: string;
	designation: string;
	quote: string;
	image: SanityImageSource;
}

type Props = {
	testimonials: Testimonial[];
	initialSlide: number;
};

// Custom Previous Arrow Component
function SamplePrevArrow(props: { onClick: MouseEventHandler }) {
	const { onClick } = props;
	return (
		<button
			onClick={onClick}
			className="architekt text-[14px] w-auto min-w-[140px] h-[50px] md:w-auto absolute bottom-[-60px] border border-[var(--alembic-black)] text-[var(--alembic-black)] hover:border-[var(--alembic-purple)] hover:bg-[var(--alembic-purple)] hover:text-white"
			style={{ right: "150px" }}
		>
			&lt; Previous
		</button>
	);
}

// Custom Next Arrow Component
function SampleNextArrow(props: { onClick: MouseEventHandler }) {
	const { onClick } = props;
	return (
		<button
			onClick={onClick}
			className="architekt text-[14px] min-w-[140px] h-[50px] md:w-auto absolute bottom-[-60px] right-0 border border-[var(--alembic-black)] text-[var(--alembic-black)] hover:border-[var(--alembic-purple)] hover:bg-[var(--alembic-purple)] hover:text-white"
		>
			Next &gt;
		</button>
	);
}

export default function TestimonialSliderTemplate({
	testimonials,
	initialSlide,
}: Props) {
	const settings = {
		dots: false,
		arrows: true,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		initialSlide: initialSlide,
		nextArrow: (
			<SampleNextArrow
				onClick={() => console.log("Prev arrow clicked!")}
			/>
		),
		prevArrow: (
			<SamplePrevArrow
				onClick={() => console.log("Prev arrow clicked!")}
			/>
		),
	};

	return (
		<div className="relative">
			<Slider {...settings}>
				{testimonials?.map((testimonial) => (
					<div className="slides" key={testimonial._key}>
						<div className="flex flex-row flex-wrap max-w-[1210px]">
							<div className="md:basis-1/3 w-[100%] mt-5">
								<Image
									src={
										urlFor(testimonial.image)
											?.fit("max")
											.url() ?? ""
									}
									alt={testimonial.name}
									width={400}
									height={500}
									className="max-h-[500px] w-[full] object-auto"
								/>
							</div>
							<div className="md:basis-2/3 md:px-6 px-0">
								<div className="flex flex-col justify-between gap-5 md:ml-5 ml-0">
									<h2 className="xl:text-[48px] md:text-[36px] text-[24px] font-semibold max-w-[700px] xl:leading-[48px] md:leading-[35px] leading-[30px]">
										{testimonial.quote}
									</h2>
									<div className="bottom-description flex flex-row justify-between items-center">
										<div className="author">
											<h4 className="md:text-[32px] text-[18px] font-semibold">
												{testimonial.name}
											</h4>
											<span className="md:text-[18px] text-[14px] tracking-[-0.4px]">
												{testimonial.designation}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
}
