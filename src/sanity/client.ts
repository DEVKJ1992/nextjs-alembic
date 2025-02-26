import { createClient } from "next-sanity";

export const client = createClient({
	projectId: "8dklkuhz",
	dataset: "production",
	apiVersion: "2025-01-01",
	useCdn: false,
});
