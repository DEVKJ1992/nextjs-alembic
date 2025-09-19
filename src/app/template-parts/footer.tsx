"use client";

import Link from "next/link";
import Image from "next/image";
import { MenuItem } from "../utility-functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faXTwitter,
	faYoutube,
	faLinkedin,
	faBluesky,
} from "@fortawesome/free-brands-svg-icons";

const d = new Date();
const year = d.getFullYear();

export default function Footer(props: {
	logoUrl: string;
	footerNav: MenuItem;
	legalNav: MenuItem;
}) {
	return (
		<footer className="bg-[var(--alembic-black)] text-white p-8">
			<div className="container mx-auto flex flex-col gap-5 lg:flex-row justify-between items-center border-b border-white py-10 mb-6">
				<div className="flex-1">
					<Link href="/" className="flex-shrink-0">
						<Image
							src={props?.logoUrl}
							alt="Alembic Logo"
							className="h-8"
							width="175"
							height="36"
						/>
					</Link>
				</div>
				<div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-12 justify-center items-center">
					{props?.footerNav?.map((item) => (
						<span key={item._key}>
							<Link
								href={item.link}
								className="block text-white hover:text-gray-400"
							>
								{item.title}
							</Link>
						</span>
					))}
				</div>
				<div className="flex-1 flex justify-end items-end">
					<Link
						href="https://app.getalembic.com/"
						target="_blank"
						className="architekt text-white px-4 py-2 rounded"
					>
						LOGIN
					</Link>
					<Link
						href="/book-a-consultation"
						className="architekt border border-white text-white px-4 py-2 rounded"
					>
						TALK TO SALES
					</Link>
				</div>
			</div>

			<div className="container mx-auto flex lg:flex-row gap-5 flex-col justify-between items-center py-6 mb-6">
				<div className="flex-1">
					<p className="text-white">@ Alembic {year}</p>
				</div>
				<div className="flex-1 flex gap-8 justify-center">
					{props?.legalNav?.map((item) => (
						<span key={item._key}>
							<Link
								href={item.link}
								className="block text-white hover:text-gray-400"
							>
								{item.title}
							</Link>
						</span>
					))}
				</div>
				<div className="flex-1 flex justify-end items-end gap-5">
					<Link
						href="https://www.linkedin.com/company/getalembic/"
						target="_blank"
						className="block text-white hover:text-gray-400"
					>
						<FontAwesomeIcon
							icon={faLinkedin}
							className="fab text-[24px] fa-linkedin mr-2"
						></FontAwesomeIcon>
					</Link>
					<Link
						href="https://twitter.com/getalembic"
						target="_blank"
						className="block text-white hover:text-gray-400"
					>
						<FontAwesomeIcon
							icon={faXTwitter}
							className="fab text-[24px] fa-x-twitter mr-2"
						></FontAwesomeIcon>
					</Link>
					<Link
						href="https://www.youtube.com/@AlembicTechnologies"
						target="_blank"
						className="block text-white hover:text-gray-400"
					>
						<FontAwesomeIcon
							icon={faYoutube}
							className="fab text-[24px] fa-youtube mr-2"
						></FontAwesomeIcon>
					</Link>
					<Link
						href="https://bsky.app/profile/getalembic.bsky.social"
						target="_blank"
						className="block text-white hover:text-gray-400"
					>
						<FontAwesomeIcon
							icon={faBluesky}
							className="fab text-[24px] fa-bluesky mr-2"
						></FontAwesomeIcon>
					</Link>
				</div>
			</div>
			<div className="container mx-auto">
				<p className="text-white text-[16px]">
					Looking for Alembic Guitars? Please visit their{" "}
					<a href="https://www.alembicguitars.com/" target="_blank">
						official website.
					</a>
				</p>
			</div>
		</footer>
	);
}
