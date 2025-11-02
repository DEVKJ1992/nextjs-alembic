"use client";

import { useState } from "react";
import Modal from "react-modal";
import Link from "next/link";
import Image from "next/image";
import { PortableText, type SanityDocument } from "next-sanity";
import { urlFor, components } from "../utility-functions";
import Button from "../components/Button";

export function VideoOffsetContent(props: { data: SanityDocument }) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<div className="vid-box max-w-[1220px] mx-auto mt-36 pb-20 relative flex flex-col items-center">
			<Image
				src={urlFor(props?.data?.bgImage)?.url() ?? ""}
				alt=""
				width={1220}
				height={682}
			></Image>
			{props?.data?.youtubeUrl && (
				<Link
					onClick={openModal}
					href="#"
					className="w-[105] flex justify-center items-center absolute top-[10vw]"
				>
					<span>
						<Image
							src="/images/icon-play.svg"
							alt=""
							width={105}
							height={105}
						></Image>
					</span>
				</Link>
			)}

			{props?.data?.youtubeUrl && (
				<Modal
					isOpen={isOpen}
					onRequestClose={closeModal}
					contentLabel="YouTube Video Modal"
					className="modal"
					overlayClassName="overlay"
					ariaHideApp={false}
				>
					<div className="relative w-full h-0 pb-[56.25%]">
						<iframe
							src={props?.data?.youtubeUrl}
							title="YouTube Video"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="absolute top-0 left-0 w-full h-full"
						></iframe>
					</div>
				</Modal>
			)}

			<div className="txt-head max-w-[966px] mx-auto bg-white p-10 md:mt-[-320px] mt-0 z-10 relative">
				<h3
					className={`text-[32px] font-semibold leading-[35px] ${props?.data?.style === "Style 1" ? "max-w-[650px]" : ""}`}
				>
					{props?.data?.sectionTitle}
				</h3>
				{props?.data?.style === "Style 1" ? (
					<div className="flex flex-wrap gap-3 justify-between mt-10">
						{props?.data?.body?.map(
							(item: SanityDocument) =>
								item && (
									<div
										className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col py-5"
										key={item._key}
									>
										<h4 className="text-[18px] pb-0 font-bold mt-5">
											{item.title}
										</h4>
										<PortableText
											value={item.text}
											components={components}
										/>
									</div>
								)
						)}
						{props?.data?.ctaText && (
							<div className="w-[100%] flex flex-col">
								<Button
									href={props?.data?.ctaUrl}
									variant="primary"
									className="ml-auto"
								>
									{props?.data?.ctaText}
								</Button>
							</div>
						)}
					</div>
				) : (
					<div className="flex flex-wrap gap-3 justify-between mt-10">
						{props?.data?.body?.map(
							(item: SanityDocument) =>
								item && (
									<div
										className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col py-2"
										key={item._key}
									>
										{/* <h4 className="text-[18px] pb-0 font-bold mt-5">
											{item.title}
										</h4> */}
										<PortableText
											value={item.text}
											components={components}
										/>
										{item?.image && (
											<Image
												src={
													urlFor(
														item?.image
													)?.url() ?? ""
												}
												alt=""
												width={400}
												height={250}
											></Image>
										)}
									</div>
								)
						)}

						{props?.data?.ctaText && (
							<div className="w-[100%] flex flex-col">
								<Button
									href={props?.data?.ctaUrl}
									variant="primary"
									className="mt-6"
								>
									{props?.data?.ctaText}
								</Button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export function VideoOffsetContentMethodology() {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<div className="vid-box max-w-[1220px] mx-auto mt-36 pb-20 relative flex flex-col items-center">
			<Image
				src="/images/video-methodology1.png"
				alt=""
				width={1220}
				height={682}
			></Image>
			<Link
				onClick={openModal}
				href="#"
				className="w-[105] flex justify-center items-center absolute top-[10vw]"
			>
				<span>
					<Image
						src="/images/icon-play.svg"
						alt=""
						width={105}
						height={105}
					></Image>
				</span>
			</Link>

			<Modal
				isOpen={isOpen}
				onRequestClose={closeModal}
				contentLabel="YouTube Video Modal"
				className="modal"
				overlayClassName="overlay"
				ariaHideApp={false}
			>
				<div className="relative w-full h-0 pb-[56.25%]">
					<iframe
						src="https://www.youtube.com/embed/JkfIjsi-iYQ?autoplay=1"
						title="YouTube Video"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="absolute top-0 left-0 w-full h-full"
					></iframe>
				</div>
			</Modal>

			<div className="txt-head max-w-[966px] mx-auto bg-white p-10 md:mt-[-320px] mt-0 z-10 relative">
				<h3 className="text-[32px] leading-[35px] font-semibold">
					Alembic’s causal AI can ingest and understand over 100
					billion rows of data
				</h3>
				<div className="flex flex-wrap gap-3 justify-between mt-5">
					<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col pt-5 pb-0">
						<p className="text-[16px]">
							Alembic’s Marketing Intelligence Platform instantly
							quantifies and interprets your information,
							delivering the important insights you need to evolve
							your marketing and drive more revenue.
						</p>
					</div>
					<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col py-5"></div>
					<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col py-5 pb-5 pt-0">
						<Button
							href="/book-a-consultation"
							variant="primary"
							className="mr-auto"
						>
							TALK TO SALES
						</Button>
					</div>
					<div className="xl:w-[47%] md:w-[47%] w-[100%] flex flex-col py-5"></div>
					<div className="w-[100%] flex flex-col"></div>
				</div>
			</div>
		</div>
	);
}
