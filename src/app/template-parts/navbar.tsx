"use client"; // Mark this as a Client Component

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { MenuItem } from "../utility-functions";

export default function Navbar(props: { logoUrl: string; nav: MenuItem }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Toggle menu visibility
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Close the menu when a link is clicked
	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<nav className="bg-white fixed w-full z-20 px-4">
			<div className="container mx-auto">
				<div className="flex justify-between items-center h-20">
					{/* Logo on the left */}
					<Link href="/" className="flex-shrink-0">
						<Image
							className="h-8 w-auto filter invert-[100%]"
							src={props.logoUrl}
							alt="Alembic Logo"
							width="175"
							height="36"
						/>
					</Link>

					{/* Menu on the right (desktop) */}
					<div className="hidden md:flex space-x-4">
						{props?.nav?.map((item) =>
							item.link === "#" ? (
								<div className="relative group" key={item._key}>
									<button className="px-3 py-2 flex items-center">
										{item.title}
										<svg
											className="w-4 h-4 ml-1"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
									{/* Dropdown Content */}
									<div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg py-2 w-48">
										{item.submenu?.map((subItem) => (
											<Link
												href={subItem.link}
												key={subItem._key}
												className="block px-4 py-2"
											>
												{subItem.title}
											</Link>
										))}
									</div>
								</div>
							) : (
								<Link href={item.link} key={item._key} className="px-3 py-2">
									{item.title}
								</Link>
							)
						)}
					</div>

					<div className="hidden md:block">
						<Link
							href="https://app.getalembic.com/"
							target="_blank"
							className="architekt px-4 py-2"
						>
							LOGIN
						</Link>
						<Link
							href="/book-a-consultation"
							className="architekt border border-black px-4 py-2 inline-block"
						>
							TALK TO SALES
						</Link>
					</div>

					{/* Burger menu for mobile */}
					<div className="md:hidden flex items-center">
						<button
							title="Toggle Menu"
							type="button"
							onClick={toggleMenu}
							className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
						>
							<svg
								className="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{isMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16m-7 6h7"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile menu (collapsible) */}
				{isMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							{/* Dropdown for Mobile */}
							{props?.nav?.map((item) =>
								item.link === "#" ? (
									<div key={item._key}>
										<button className="w-full text-left px-3 py-2 flex items-center justify-between">
											{item.title}
											<svg
												className="w-4 h-4"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<div className="pl-4">
											{item.submenu?.map((subItem) => (
												<Link
													href={subItem.link}
													className="block px-3 py-2"
													onClick={closeMenu}
													key={subItem._key}
												>
													{subItem.title}
												</Link>
											))}
										</div>
									</div>
								) : (
									<Link
										href={item.link}
										className="block px-3 py-2"
										onClick={closeMenu}
										key={item._key}
									>
										{item.title}
									</Link>
								)
							)}

							<Link
								href="https://app.getalembic.com/"
								className="architekt block px-3 py-2 text-center border border-black px-4 py-2"
								onClick={closeMenu}
							>
								LOGIN
							</Link>
							<Link
								href="/book-a-consultation"
								className="architekt block px-3 py-2 border text-center border-black px-4 py-2"
								onClick={closeMenu}
							>
								TALK TO SALES
							</Link>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
