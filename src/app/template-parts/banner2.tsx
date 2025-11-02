import { urlFor } from "../utility-functions";
import { type SanityDocument } from "next-sanity";
import { headers } from "next/headers";
import Button from "../components/Button";
import { PortableText } from "next-sanity";

function isMobileDevice(userAgent: string): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		userAgent
	);
}

export async function Banner2(props: {
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
				<div className="banner banner2 max-w-[1220px] mx-auto py-36 xl:px-0 px-5 relative z-10">
					<div className="col max-w-[1000px]">
						<h1>{props.data.title}</h1>
						<div
							className={`max-w-[800px] ${props.data.contentBackground ? "bg-white px-10 pb-10" : ""}`}
						>
							<div className="max-w-[700px] my-8">
								<h2 className="pt-10">{props.data.subtitle}</h2>
								<div className="max-w-[600px]">
									<PortableText value={props.data.body} />
								</div>
							</div>
							<div className="btn-col max-w-[700px] flex md:flex-row flex-col flex-wrap gap-3">
								{props.data.cta1Text && (
									<Button
										href={props.data.cta1Url}
										variant="primary"
										className="max-w-[400px] flex-1"
										noIcon
									>
										{props.data.cta1Text + " >"}
									</Button>
								)}
								{props.data.cta2Text && (
									<Button
										href={props.data.cta2Url}
										variant="secondary"
										className="flex-1"
									>
										{props.data.cta2Text}
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
