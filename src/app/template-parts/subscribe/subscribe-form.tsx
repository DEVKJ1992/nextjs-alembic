import { getData } from "../../utility-functions";
import SubscribeFormTemplate from "./subscribe-form-template";
import { SanityDocument } from "next-sanity";

export default async function SubscribeForm() {
	const data = (await getData(
		`*[_type == "subscriptionForm"][0]`,
		"Subscribe Form"
	)) as SanityDocument;

	if (!data) {
		return null;
	}

	return <SubscribeFormTemplate data={data} />;
}
