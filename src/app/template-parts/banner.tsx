import { urlFor } from "../utility-functions";
import { type SanityDocument } from "next-sanity";
import { headers } from "next/headers";
import Button from "../components/Button";

function isMobileDevice(userAgent: string): boolean {
	// A simple but effective way to detect mobile on the server
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		userAgent
	);
}

export async function Banner(props: {
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
					className={`absolute top-0 left-0 w-full h-full bg-cover bg-center z-0 ${props?.bannerVideo ? "md:hidden block" : ""}`}
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
				<div className="banner max-w-[1220px] mx-auto py-36 xl:px-0 px-5 relative z-10">
					<div className="col max-w-[900px]">
						<h1>{props.data.title}</h1>
						<p className="max-w-[600px] my-8">{props.data.body}</p>
						<div className="btn-col max-w-[700px] flex md:flex-row flex-col flex-wrap gap-3">
							<Button
								href={props.data.cta1Url}
								variant="secondary"
								className="w-full md:w-max flex-1"
								noIcon
							>
								{props.data.cta1Text}
							</Button>
							<Button
								href={props.data.cta2Url}
								variant="primary"
								className="flex-1"
							>
								{props.data.cta2Text}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
