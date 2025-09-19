"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { PortableText, type SanityDocument } from "next-sanity";
import { ContentItem, components, urlFor } from "../utility-functions";
import Button from "../components/Button";

export function StickyImage(props: {
	data: SanityDocument;
	instance: number;
	wpLink?: string;
}) {
	useEffect(() => {
		const contentSections = document.querySelectorAll(
			".content-section" + props.instance
		);
		const images = document.getElementsByClassName(
			"stickyImage" + props.instance
		);
		const headings = document.querySelectorAll(".numH" + props.instance);
		const scrollContainer = document.getElementById(
			"scroll-container" + props.instance
		);

		// Function to handle scroll events
		const handleScroll = () => {
			if (!scrollContainer) return;
			let cOffset = 220;
			if (props?.instance && props?.instance > 1) {
				cOffset = 0;
			}
			// Calculate the maximum scrollable height for the images
			const containerBottom =
				scrollContainer.getBoundingClientRect().bottom - cOffset;
			const viewportHeight = window.innerHeight;

			contentSections.forEach((section, index) => {
				const rect = section.getBoundingClientRect();
				// Check if the section is in the middle of the viewport
				if (
					rect.top <= viewportHeight / 2 &&
					rect.bottom >= viewportHeight / 2
				) {
					// Hide all images
					Array.from(images).forEach((image) =>
						image?.classList.add("opacity-0")
					);
					// Show the corresponding image
					images[index]?.classList.remove("opacity-0");
					// Remove multiple classes from all headings
					headings.forEach((heading) => {
						heading.classList.remove(
							"bg-[var(--alembic-purple)]",
							"text-white"
						);
					});
					// Add multiple classes to the current heading
					headings[index].classList.add(
						"bg-[var(--alembic-purple)]",
						"text-white"
					);
				}
			});

			Array.from(images).forEach((image) => {
				if (image) {
					const imageBottom = image.getBoundingClientRect().bottom;
					if (imageBottom > containerBottom) {
						// Calculate the offset to keep the image within the container
						const offset = imageBottom - containerBottom;
						(image as HTMLElement).style.transform =
							`translateY(-${offset}px)`;
					} else {
						// Reset the transform if the image is within bounds
						(image as HTMLElement).style.transform =
							"translateY(0)";
					}
				}
			});
		};

		// Add scroll event listener
		window.addEventListener("scroll", handleScroll);

		// Initial call to set the first image
		handleScroll();

		// Cleanup the event listener on component unmount
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [props.instance, props?.wpLink]);
	return (
		<div
			id={`scroll-container` + props.instance}
			className="py-10 md:px-0 px-8"
		>
			<div className="max-w-[1220px] mx-auto">
				<h2 className="max-w-[1150px] md:text-[96px] md:leading-[96px] font-semibold text-[40px] leading-[42px]">
					{props?.data?.sectionTitle}
				</h2>
				{props?.data?.sectionText && (
					<p className="font-medium md:max-w-[50%] mt-5">
						{props?.data?.sectionText}
					</p>
				)}
				{props?.data?.ctaUrl && (
					<Button
						href={props?.data?.ctaUrl}
						variant="secondary"
						className="flex-1"
						noIcon
					>
						{props?.data?.ctaText} &gt;
					</Button>
				)}

				<div className="flex flex-wrap gap-5 justify-between mt-10 relative">
					<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col md:py-5">
						{props?.data?.content?.map(
							(item: ContentItem, index: number) => (
								<React.Fragment key={item._key}>
									<div
										className={
											`content-section` + props.instance
										}
									>
										<div
											className={`numH${props.instance} architekt rounded-[40px] border border-[var(--alembic-purple)] w-max px-[16px] py-[6px] my-5 text-[var(--alembic-purple)] bg-[var(--alembic-purple)]`}
										>
											0{index + 1}
										</div>
										<h3 className="text-[var(--alembic-black)] text-[32px] leading-[35px] font-medium pt-0 pb-5">
											{item.title}
										</h3>
										<PortableText
											value={item.text}
											components={components}
										/>
									</div>
									<div className="md:hidden block mt-10">
										<Image
											src={
												urlFor(item.image)
													?.fit("max")
													.url() ?? ""
											}
											alt="Mobile Image"
											width={450}
											height={200}
											className="w-full"
										/>
									</div>
								</React.Fragment>
							)
						)}
					</div>

					<div className="xl:w-[47%] md:w-[47%] w-[100%] relative md:py-5">
						{props?.data?.content?.map((item: ContentItem) => (
							<div
								className="md:block hidden image-container sticky top-[20%]"
								key={item._key}
							>
								<Image
									src={
										urlFor(item.image)?.fit("max").url() ??
										""
									}
									alt="Sticky Image"
									width={750}
									height={500}
									className={`stickyImage${props.instance} top-0 absolute opacity-0 transition-opacity duration-500 md:block hidden`}
								/>
							</div>
						))}
					</div>
				</div>
				{props?.wpLink && (
					<a
						href={`${props.wpLink}?dl=`}
						download
						className="btn-al btn-primary inline-block"
					>
						{props?.data?.ctaText}
					</a>
				)}
			</div>
		</div>
	);
}
