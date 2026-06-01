import { urlFor } from "../utility-functions";
import { type SanityDocument } from "next-sanity";
import { headers } from "next/headers";
import Button from "../components/Button";
import { PortableText } from "next-sanity";

function isMobileDevice(userAgent: string): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		userAgent,
	);
}

export async function BannerWithQuote(props: {
	data: SanityDocument;
	bannerVideo: string;
}) {
	const headersList = await headers();
	const userAgent = headersList.get("user-agent") || "";
	const isMobile = isMobileDevice(userAgent);

	return (
		<div className="banner-bg min-h-screen relative overflow-hidden">
			{/* Video Background */}
			{!isMobile && props?.bannerVideo && (
				<video
					autoPlay
					muted
					loop
					className="absolute top-0 left-0 w-full h-full object-cover z-0"
					playsInline // Prevents full-screen playback on iOS
				>
					<source
						src={
							props?.bannerVideo
								? "/resources/alembic-hyperloop-v2.mp4"
								: ""
						}
						type="video/mp4"
					/>
					Your browser does not support the video tag
				</video>
			)}

			{/* Image Background (for mobile) */}
			{isMobile || !props?.bannerVideo ? (
				<div
					className={`absolute top-0 left-0 w-full h-full bg-cover bg-center z-0 ${props?.data?.solidBackground ? "force-mobile-bg" : ""} ${props?.bannerVideo ? "md:hidden block" : ""}`}
					style={{
						backgroundImage:
							"url(" +
							(props?.data?.backgroundImage
								? urlFor(props?.data?.backgroundImage)?.url()
								: "/images/video-bg-mobile.jpg") +
							")",
					}}
				></div>
			) : null}

			{/* Content */}
			{props?.data && (
				<div className="banner max-w-[1220px] mx-auto pt-36 pb-0 xl:px-0 px-5 relative z-10">
					<div className="col max-w-[900px]">
						<h1 className="md:max-w-full max-w-[70%]">
							{props.data.title}
						</h1>
						<div className="max-w-[600px] my-1">
							<PortableText value={props.data.body} />
						</div>
						<div className="btn-col max-w-[700px] flex md:flex-row flex-col flex-wrap gap-3">
							{props.data.cta1Text && (
								<Button
									href={props.data.cta1Url}
									variant="secondary"
									className="w-full md:w-max flex-1"
									noIcon
								>
									{props.data.cta1Text}
								</Button>
							)}
							{props.data.cta2Text && (
								<Button
									href={props.data.cta2Url}
									variant="primary"
									className="flex-1 w-full md:max-w-[260px]"
								>
									{props.data.cta2Text}
								</Button>
							)}
						</div>
					</div>

					<div className="slider-testimonial">
						<div className="banner max-w-[800px] py-20 xl:px-0 px-5">
							<div className="col-head flex items-center gap-0 relative">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="62"
									height="53"
									viewBox="0 0 62 53"
									fill="none"
								>
									<path
										d="M30.1201 4V18.1201H24.2002C21.6193 18.1201 20.4243 18.7426 19.8633 19.2822C19.3312 19.7941 18.7197 20.8571 18.7197 23.2402V23.7998H28.3203V48.1201H4V23.5996C4.00007 18.0439 5.54764 13.1705 9.0498 9.45605L9.09082 9.41309C12.8 5.59479 17.9925 4.00001 23.96 4H30.1201ZM57.7197 4V18.1201H51.7998C49.2187 18.1201 48.0238 18.7426 47.4629 19.2822C46.9308 19.7941 46.3203 20.8571 46.3203 23.2402V23.7998H55.9199V48.1201H31.5996V23.5996C31.5997 18.044 33.1474 13.1705 36.6494 9.45605L36.6904 9.41309C40.3995 5.59488 45.5923 4.00008 51.5596 4H57.7197Z"
										fill="#8B71F6"
										stroke="#D4D4D4"
										strokeWidth="8"
									/>
								</svg>
								<hr className="w-[100%] border-black" />
							</div>
							<div className="relative">
								{props?.data?.testimonial && (
									<div className="slides px-[0.05rem]">
										<div className="flex flex-row flex-wrap max-w-[800px]">
											<div className="px-0">
												<div className="flex flex-col justify-between gap-5 md:ml-5 ml-0">
													<h2 className="xl:text-[34px] md:text-[32px] text-[24px] font-semibold max-w-[700px] xl:leading-[48px] md:leading-[35px] leading-[30px]">
														{
															props?.data
																?.testimonial
																.quote
														}
													</h2>
													<div className="bottom-description flex flex-row justify-between items-center">
														<div className="author">
															<h4 className="md:text-[32px] text-[18px] font-semibold">
																{
																	props?.data
																		?.testimonial
																		.name
																}
															</h4>
															<span
																className="md:text-[18px] text-[14px] tracking-[-0.4px]"
																dangerouslySetInnerHTML={{
																	__html:
																		props
																			?.data
																			?.testimonial
																			?.designation ||
																		"",
																}}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
