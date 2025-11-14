"use client";

import { useEffect, useState } from "react";
import { type SanityDocument } from "next-sanity";
import Image from "next/image";

export default function WhitepaperPage({
	whitepaper,
}: {
	whitepaper: SanityDocument;
}) {
	useEffect(() => {
		// Load Turnstile script dynamically
		const script = document.createElement("script");
		script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		companyName: "",
		title: "",
		email: "",
		country: "US",
		phone: "",
		how: "",
		howOther: "",
		contactFormType: "Whitepaper",
		url: whitepaper.url ?? "",
		pageTitle: whitepaper.eyebrowTitle ?? "Whitepaper",
		whitepaperUrl: whitepaper.whitepaperURL
			? `${whitepaper.whitepaperURL}?dl=`
			: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [message, setMessage] = useState("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setMessage("");

		const turnstileTokenF = (
			document.querySelector(
				'input[name="cf-turnstile-response"]'
			) as HTMLInputElement
		)?.value;

		if (!turnstileTokenF) {
			setMessage("Turnstile verification failed. Please try again.");
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await fetch("/api/submit-form", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					turnstileToken: turnstileTokenF,
					pageTitle: whitepaper.eyebrowTitle ?? "Whitepaper", // Auto-populate the hidden field
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setIsSubmitted(true);
				setFormData({
					firstName: "",
					lastName: "",
					companyName: "",
					title: "",
					email: "",
					phone: "",
					country: "US",
					how: "",
					howOther: "",
					contactFormType: "Whitepaper",
					pageTitle: whitepaper.eyebrowTitle ?? "Whitepaper",
					url: whitepaper.url ?? "",
					whitepaperUrl: whitepaper.whitepaperURL
						? `${whitepaper.whitepaperURL}?dl=`
						: "",
				});
			} else {
				setMessage("Something went wrong. Please try again.");
				console.error(data.message);
			}
		} catch (error) {
			setMessage("An error occurred. Please try again.");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="py-20 no-footer-section">
			<div className="flex gap-2 max-w-[1220px] xl:px-0 px-5 flex-row xl:mt-20 lg:mt-20 md:mt-15 mt-5 flex-wrap mx-auto">
				<div className="left-col xl:flex-1 lg:flex-1 md:flex-1">
					<div className="max-w-[1220px] mx-auto xl:px-0 md:px-5 px-0 mb-8">
						<p className="architekt uppercase text-[var(--alembic-purple)] mb-0 pb-0]">
							{whitepaper.eyebrowTitle}
						</p>
						<h1 className="font-normal md:text-[64px] text-[36px] md:leading-[70px] leading-[45px] mt-0 pt-0">
							{whitepaper.title}
						</h1>
					</div>
					<div className="px-5 border-l-2 border-[var(--alembic-purple)]">
						<p className="max-w-[575px] text-[var(--alembic-black)] text-[16px] font-medium">
							<span
								dangerouslySetInnerHTML={{
									__html: whitepaper.description,
								}}
							/>
						</p>
					</div>
					<div className="col-head flex items-center gap-5 relative mt-16 pr-5">
						<hr className="w-[100%] border-black" />
						<Image
							src="/images/quote.svg"
							alt=""
							width={50}
							height={50}
							className="absolute top-[-25px] left-[86%]"
						></Image>
					</div>
					<p className="font-semibold text-[24px] leading-[28px] mt-10">
						AI-native simulation platforms are transforming
						enterprise decision-making by embedding AI assistants,
						automation, and natural language interfaces.
					</p>
					<p className="font-semibold text-[32px] mt-2 pb-2">
						Gartner
					</p>
					<p className="">2025 (1)</p>
				</div>
				<div className="right-col xl:flex-1 lg:flex-1 flex-1 md:p-6 p-0">
					<h3 className="font-normal text-[32px] md:leading-[40px] pt-10 pb-5">
						{whitepaper.shortTitle}
					</h3>
					<form onSubmit={handleSubmit} className="w-full max-w-2xl">
						{isSubmitted ? (
							// Display success message
							<div className="flex flex-col gap-[20px] h-full justify-center">
								<svg
									width="62"
									height="61"
									viewBox="0 0 62 61"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="mx-auto"
								>
									<path
										d="M41.1186 24.1614C41.2065 24.2492 41.2762 24.3534 41.3237 24.4681C41.3713 24.5828 41.3958 24.7058 41.3958 24.83C41.3958 24.9542 41.3713 25.0772 41.3237 25.1919C41.2762 25.3066 41.2065 25.4108 41.1186 25.4986L27.8886 38.7286C27.8008 38.8164 27.6966 38.8862 27.5819 38.9337C27.4672 38.9813 27.3442 39.0057 27.22 39.0057C27.0958 39.0057 26.9729 38.9813 26.8581 38.9337C26.7434 38.8862 26.6392 38.8164 26.5514 38.7286L20.8814 33.0586C20.7041 32.8813 20.6045 32.6408 20.6045 32.39C20.6045 32.1392 20.7041 31.8987 20.8814 31.7214C21.0587 31.5441 21.2992 31.4445 21.55 31.4445C21.8008 31.4445 22.0413 31.5441 22.2186 31.7214L27.22 36.7228L39.7814 24.1614C39.8692 24.0735 39.9734 24.0038 40.0881 23.9563C40.2029 23.9087 40.3258 23.8843 40.45 23.8843C40.5742 23.8843 40.6972 23.9087 40.8119 23.9563C40.9266 24.0038 41.0308 24.0735 41.1186 24.1614ZM54.625 30.5C54.625 35.1726 53.2394 39.7402 50.6435 43.6253C48.0475 47.5105 44.3578 50.5385 40.0409 52.3267C35.724 54.1148 30.9738 54.5826 26.391 53.671C21.8082 52.7595 17.5986 50.5094 14.2946 47.2054C10.9906 43.9014 8.74053 39.6918 7.82896 35.109C6.91738 30.5262 7.38524 25.776 9.17336 21.4591C10.9615 17.1422 13.9896 13.4525 17.8747 10.8565C21.7598 8.26058 26.3274 6.875 31 6.875C37.2636 6.88188 43.2688 9.37314 47.6978 13.8022C52.1269 18.2313 54.6181 24.2364 54.625 30.5ZM52.735 30.5C52.735 26.2012 51.4603 21.999 49.072 18.4247C46.6837 14.8504 43.2892 12.0645 39.3176 10.4195C35.3461 8.77441 30.9759 8.34398 26.7597 9.18263C22.5435 10.0213 18.6707 12.0913 15.631 15.131C12.5913 18.1707 10.5213 22.0435 9.68264 26.2597C8.84399 30.4759 9.27442 34.8461 10.9195 38.8176C12.5646 42.7892 15.3504 46.1837 18.9247 48.572C22.499 50.9603 26.7012 52.235 31 52.235C36.7626 52.2287 42.2873 49.9368 46.3621 45.8621C50.4368 41.7873 52.7288 36.2626 52.735 30.5Z"
										fill="#8B71F6"
									/>
								</svg>

								<h4 className="uppercase text-[var(--alembic-purple)] text-[14px] text-center tracking-[1.4px] architekt font-normal">
									your submission has been sent.
								</h4>
								<h3 className="text-[var(--alembic-black)] font-semibold text-center p-0">
									Thank you
								</h3>
							</div>
						) : (
							<>
								{/* Responsive Grid for Name Fields */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* First Name */}
									<div>
										<label className="block text-sm font-medium text-gray-700">
											First name
										</label>
										<input
											type="text"
											name="firstName"
											value={formData.firstName ?? ""}
											onChange={handleChange}
											placeholder="First name"
											className="mt-1 block w-full border-[#D0D5DD80] border-2 focus:border-indigo-500 focus:ring-indigo-500 p-2"
											required
										/>
									</div>
									{/* Last Name */}
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Last name
										</label>
										<input
											type="text"
											name="lastName"
											value={formData.lastName ?? ""}
											onChange={handleChange}
											placeholder="Last name"
											className="mt-1 block w-full border-[#D0D5DD80] border-2 focus:border-indigo-500 focus:ring-indigo-500 p-2"
											required
										/>
									</div>
								</div>

								{/* Email */}
								<div className="mt-4">
									<label className="block text-sm font-medium text-gray-700">
										Email
									</label>
									<input
										type="email"
										name="email"
										value={formData.email ?? ""}
										onChange={handleChange}
										placeholder="you@company.com"
										className="mt-1 block w-full border-[#D0D5DD80] border-2 focus:border-indigo-500 focus:ring-indigo-500 p-2"
										required
									/>
								</div>

								{/* Company */}
								<div className="mt-4">
									<label className="block text-sm font-medium text-gray-700">
										Company
									</label>
									<input
										type="text"
										name="companyName"
										value={formData.companyName ?? ""}
										onChange={handleChange}
										placeholder="Acme Corp."
										required
										className="mt-1 block w-full border-[#D0D5DD80] border-2 focus:border-indigo-500 focus:ring-indigo-500 p-2"
									/>
								</div>

								{/* Title */}
								<div className="mt-4">
									<label className="block text-sm font-medium text-gray-700">
										Title
									</label>
									<input
										type="text"
										name="title"
										value={formData.title ?? ""}
										onChange={handleChange}
										placeholder="Your title"
										required
										className="mt-1 block w-full border-[#D0D5DD80] border-2 focus:border-indigo-500 focus:ring-indigo-500 p-2"
									/>
								</div>

								{/* Phone Number */}
								<div className="mt-4">
									<label className="block text-sm font-medium text-gray-700">
										Phone number
									</label>
									<div className="flex flex-col sm:flex-row mt-1 gap-2">
										<select
											name="country"
											value={formData.country}
											onChange={handleChange}
											aria-label="Select country"
											required
											className="border-[#D0D5DD80] border-2 px-2 bg-white sm:w-auto w-full"
										>
											<option value="US">US</option>
										</select>
										<input
											type="text"
											name="phone"
											value={formData.phone ?? ""}
											onChange={handleChange}
											placeholder="+1 (555) 000-0000"
											className="flex-1 border-[#D0D5DD80] border-2 focus:border-indigo-500 focus:ring-indigo-500 p-2"
											required
										/>
									</div>
								</div>

								{/* Message */}
								<div className="mt-4">
									<label className="block text-sm font-medium text-gray-700">
										How did you hear about Alembic?
									</label>
									<div className="flex flex-col sm:flex-row mt-1 gap-2">
										<select
											name="how"
											value={formData.how}
											onChange={handleChange}
											aria-label="How did you hear about Alembic?"
											className="border-[#D0D5DD80] border-2 p-2 bg-white w-full"
											required
										>
											<option value="">
												-- Please select one --
											</option>
											<option value="Social Media">
												Social Media (LinkedIn, X, etc.)
											</option>
											<option value="Online Search">
												Online Search (Google, Bing,
												etc.)
											</option>
											<option value="Conference or Event">
												Conference or Event
											</option>
											<option value="Partner or Agency Referral">
												Partner or Agency Referral
											</option>
											<option value="Friend / Colleague">
												Friend / Colleague
											</option>
											<option value="Alembic Website or Newsletter">
												Alembic Website or Newsletter
											</option>
											<option value="Sponsored Content">
												Sponsored Content (Forbes,
												Adweek, etc.)
											</option>
											<option value="Customer Referral">
												Customer Referral
											</option>
											<option value="Other">
												Other (please specify)
											</option>
										</select>

										{/* Conditionally render input if 'Other' selected */}
										{formData.how === "Other" && (
											<input
												type="text"
												name="howOther"
												value={formData.howOther ?? ""}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														howOther:
															e.target.value,
													}))
												}
												placeholder="Please specify here"
												className="border-[#D0D5DD80] border-2 p-2 focus:border-indigo-500 focus:ring-indigo-500"
												required
											/>
										)}
									</div>
								</div>

								<input
									type="hidden"
									name="pageTitle"
									value={
										whitepaper.eyebrowTitle ?? "Whitepaper"
									}
								/>
								<input
									type="hidden"
									name="url"
									value={whitepaper.url ?? ""}
								/>
								<input
									type="hidden"
									name="contactFormType"
									value="Whitepaper"
								/>
								<input
									type="hidden"
									name="whitepaperUrl"
									value={whitepaper.whitepaperURL ?? ""}
								/>
								<div
									className="cf-turnstile mt-4"
									data-sitekey="0x4AAAAAABC4EAT8tX9Wxsa5"
								></div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={isSubmitting}
									className="btn-al btn-primary mt-8"
								>
									{isSubmitting
										? "Submitting..."
										: "SPEAK TO A STRATEGIST >"}
								</button>
								<p className="font-light text-[14px] leading-[20px] mt-5">
									Simulation — Technology and Platform
									Innovation By: Stacey Yin, Walker Black,
									Evan Brown, Mark Wah, Alfonso Velosa, Ethan
									Cai Published June 27th 2025
								</p>
							</>
						)}
					</form>
					{message && <p className="mt-2 text-red-600">{message}</p>}
				</div>
				<p className="text-[var(--alembic-black)] font-light text-[12px] leading-[17px]">
					GARTNER is a registered trademark and service mark of
					Gartner, Inc. and/or its affiliates in the U.S. and
					internationally and is used herein with permission. All
					rights reserved.
					<br />
					<br />
					Gartner does not endorse any vendor, product or service
					depicted in its research publications, and does not advise
					technology users to select only those vendors with the
					highest ratings or other designation. Gartner research
					publications consist of the opinions of Gartner’s research
					organization and should not be construed as statements of
					fact. Gartner disclaims all warranties, expressed or
					implied, with respect to this research, including any
					warranties of merchantability or fitness for a particular
					purpose.
				</p>
			</div>
		</div>
	);
}
