import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { getImageDimensions } from "@sanity/asset-utils";
import Image from "next/image";
import { PortableTextBlock } from "@portabletext/types";
import { type SanityDocument } from "next-sanity";
import { PortableTextComponents } from "@portabletext/react";

const { projectId, dataset } = client.config();
export const urlFor = (source: SanityImageSource) =>
	projectId && dataset
		? imageUrlBuilder({ projectId, dataset }).image(source)
		: null;

type SanityImageValue = {
	asset: {
		_ref: string;
		_type: "reference";
	};
	alt?: string;
	isInline: boolean;
	align?: string;
	customWidth?: number;
};
type ImageComponentProps = {
	value: SanityImageValue;
};

interface IframeEmbedProps {
	value: {
		src: string;
		height: number;
		width: number;
	};
}

export type IconWithText = {
	_key: string;
	icon: ImageComponentProps;
	title: string;
	text: string;
};

export type Stats = {
	_key: string;
	statNumber: string;
	statText: string;
};

export type MenuItem = {
	_key: string;
	title: string;
	link: string;
	submenu?: {
		_key: string;
		title: string;
		link: string;
	}[];
}[];

export type Links = {
	_key: string;
	title: string;
	url: string;
};

export type Logo = {
	_key: string;
	logo: {
		alt: string;
		url: string;
	};
};

export type ListItem = {
	_key: string;
	listID: string;
	listItem: string;
};

export type ContentItem = {
	_key: string;
	id: string;
	title: string;
	text: PortableTextBlock;
	image: SanityImageValue;
};

export type NewsItem = {
	_id: string;
	title: string;
	image: ImageComponentProps;
	logo: ImageComponentProps;
	publishedAt: Date;
	cta: string;
};

const ImageComponent = ({ value }: ImageComponentProps) => {
	const { width, height } = getImageDimensions(value);
	const imageUrl = urlFor(value)
		?.width(value.customWidth ? value.customWidth : width)
		.fit("max")
		.auto("format")
		.url();

	if (!imageUrl) {
		return null; // Skip rendering if the URL builder fails
	}

	return (
		<div
			style={{
				marginRight: "20px",
				marginBottom: "10px",
				maxWidth: value.isInline ? "550px" : value.customWidth + "px",
				display: value.isInline ? "block" : "inline-block",
				textAlign:
					value.align === "Left"
						? "left"
						: value.align === "Right"
							? "right"
							: "center",
			}}
		>
			<Image
				src={imageUrl}
				alt={value.alt || " "}
				loading="lazy"
				width={width}
				height={height}
				className="w-full h-auto"
				style={{
					width: "100%",
					aspectRatio: width / height,
				}}
			/>
		</div>
	);
};

const IframeEmbedComponent = ({ value }: IframeEmbedProps) => {
	const { src, height, width } = value;

	return (
		<div className="iframe-container">
			<iframe
				src={src}
				height={height}
				width={width}
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			></iframe>
		</div>
	);
};

export async function getData(
	query: string,
	page: string,
	params?: { slug: string },
	isDraft = false
) {
	const options = { next: { revalidate: isDraft ? 0 : 3600 } };

	let data: SanityDocument | null = null;
	try {
		// Use regular client for published content, special client for drafts
		if (isDraft) {
			// Import dynamically to avoid issues with SSR
			const { getClient } = await import("@/sanity/client");
			data = await getClient(true).fetch<SanityDocument>(
				query,
				params ?? {},
				{
					cache: "no-store",
				}
			);
		} else {
			data = await client.fetch<SanityDocument>(
				query,
				params ?? {},
				options
			);
		}
		return data;
	} catch (error) {
		console.error("Failed to fetch " + page + " data", error);
		return null;
	}
}

export const components: PortableTextComponents = {
	marks: {
		link: ({ children, value }) => {
			const { href, blank } = value;
			return blank ? (
				<a href={href} target="_blank" rel="noopener">
					{children}
				</a>
			) : (
				<a href={href} target="_self">
					{children}
				</a>
			);
		},
	},
	types: {
		image: ImageComponent,
		iframe: IframeEmbedComponent,
		code: ({ value }: { value: { code: string } }) => (
			<div
				dangerouslySetInnerHTML={{
					__html: value.code,
				}}
			/>
		),
		// Any other custom types you have in your content
		// Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
	},
};
