"use client"; // Mark this as a Client Component

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
	{ id: 1, text: "Terms of Service", href: "/terms", target: "" },
	{ id: 2, text: "Responsible Disclosure", href: "/security", target: "" },
	{
		id: 3,
		text: "SOC 3 Report",
		href: "/soc-3",
		target: "",
	},
	{
		id: 4,
		text: "Cookie Policy",
		href: "https://app.termly.io/policy-viewer/policy.html?policyUUID=f5952947-0667-46c5-8d9e-56f8a6837da9",
		target: "_blank",
	},
];

export default function TextLinks() {
	const pathname = usePathname(); // Get the current route

	return (
		<div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start p-4 mb-10">
			{links.map((link) => (
				<Link
					key={link.id}
					href={link.href}
					target={link.target}
					className={`architekt uppercase font-normal text-[14px] font-medium text-[var(--alembic-black)] hover:text-[var(--alembic-purple)] transition-colors border-b-2 pb-4 ${
						pathname === link.href
							? "border-[var(--alembic-purple)] text-[var(--alembic-purple)]" // Active state
							: "border-[#E9EAEE] hover:border-[var(--alembic-purple)]" // Default and hover state
					}`}
				>
					{link.text}
				</Link>
			))}
		</div>
	);
}
