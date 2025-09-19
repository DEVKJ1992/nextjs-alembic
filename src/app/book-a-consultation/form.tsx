"use client";
import { useState, useEffect } from "react";
import FooterSection from "../template-parts/footer-section";
import { components } from "../utility-functions";
import { PortableText } from "next-sanity";
import { PortableTextBlock } from "sanity";

type FormPage = {
	eyeBrowTitle: string;
	pageTitle: string;
	body: PortableTextBlock[];
	footer: {
		title: string;
		text: string;
		buttonText: string;
		buttonURL: string;
	};
};

type Props = {
	data: FormPage;
};

export default function TalkForm({ data }: Props) {
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
	// State for form fields
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		companyName: "",
		phone: "",
		country: "US",
		how: "Social Media",
		pageTitle: "Talk To Sales",
		contactFormType: "Talk-To-Sales",
		turnstileToken: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState("");

	// Handle input change
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
					pageTitle: "Talk To Sales",
				}),
			});

			if (response.ok) {
				setFormData({
					firstName: "",
					lastName: "",
					companyName: "",
					email: "",
					phone: "",
					country: "US",
					how: "Social Media",
					pageTitle: "Talk To Sales",
					contactFormType: "Talk-To-Sales",
					turnstileToken: "",
				});
				window.location.href = "/thank-you";
			} else {
				setMessage("Something went wrong. Please try again.");
			}
		} catch (error) {
			setMessage("An error occurred. Please try again.");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="pt-20">
			<div className="flex gap-2 max-w-[1220px] xl:px-0 px-5 flex-row xl:mt-20 lg:mt-20 md:mt-15 mt-5 flex-wrap mx-auto">
				<div className="left-col xl:flex-1 lg:flex-1 md:flex-1">
					<div className="max-w-[1220px] mx-auto xl:px-0 px-5">
						<p className="architekt text-[var(--alembic-purple)] mb-0 pb-0]">
							{data?.eyeBrowTitle}
						</p>
						<h1 className="font-normal md:text-[64px] text-[36px] md:leading-[70px] leading-[45px] mt-0 pt-0 mb-8">
							{data?.pageTitle}
						</h1>
					</div>
					<div className="px-5 border-l-2 border-[var(--alembic-purple)]">
						<PortableText
							value={data?.body}
							components={components}
						/>
					</div>
				</div>
				<div className="right-col xl:flex-1 lg:flex-1 flex-1">
					<form
						onSubmit={handleSubmit}
						className="w-full max-w-2xl bg-white p-6 sm:p-8 h-full"
					>
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
									>
										<option value="Social Media">
											Social Media
										</option>
										<option value="Online Search">
											Online Search
										</option>
										<option value="Ad">Ad</option>
										<option value="Friend">Friend</option>
									</select>
								</div>
							</div>
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
								{isSubmitting ? "Submitting..." : "SUBMIT >"}
							</button>
						</>
					</form>
					{message && <p className="mt-2 text-red-600">{message}</p>}
				</div>
			</div>
			{data?.footer && (
				<FooterSection
					title={data.footer.title}
					body={data.footer.text}
					ctaText={data.footer.buttonText}
					ctaUrl={data.footer.buttonURL}
				/>
			)}
		</div>
	);
}
