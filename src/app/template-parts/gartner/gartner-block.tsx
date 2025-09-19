import { getData } from "../../utility-functions";
import GartnerBlockTemplate from "./gartner-block-template";

export default async function GartnerBlock() {
	const data = await getData(
		'*[_type == "gartnerBlock"][0]',
		"Gartner Block"
	);

	if (!data) {
		return null;
	}

	return <GartnerBlockTemplate data={data} />;
}
