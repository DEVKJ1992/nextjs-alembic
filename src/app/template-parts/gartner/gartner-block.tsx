import { getData } from "../../utility-functions";
import GartnerBlockTemplate from "./gartner-block-template";

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

export default async function GartnerBlock() {
	const data = (await getData(
		'*[_type == "gartnerBlock"][0]',
		"Gartner Block"
	)) as GartnerBlock | null;

	if (!data) {
		return null;
	}

	return <GartnerBlockTemplate data={data} />;
}
