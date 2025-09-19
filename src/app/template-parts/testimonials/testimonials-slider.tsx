import { getData } from "../../utility-functions";
import TestimonialSliderTemplate from "./testimonials-slider-template";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface Testimonial {
	_key: string;
	name: string;
	designation: string;
	quote: string;
	image: SanityImageSource;
}

interface TestimonialSliderData {
	title?: string;
	testimonials: Testimonial[];
}

export default async function TestimonialSlider(props: {
	initialSlide: number;
}) {
	const data = (await getData(
		`*[_type == "testimonialSlider"][0]`,
		"Testimonials"
	)) as TestimonialSliderData | null;

	if (!data || !data.testimonials) {
		return null;
	}

	return (
		<TestimonialSliderTemplate
			testimonials={data.testimonials}
			initialSlide={props.initialSlide}
		/>
	);
}
