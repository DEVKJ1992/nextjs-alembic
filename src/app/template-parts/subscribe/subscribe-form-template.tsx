"use client";

import React, { useState } from "react";
import { SanityDocument } from "next-sanity";

export default function SubscribeFormTemplate(props: { data: SanityDocument }) {
	const [formData, setFormData] = useState({
		email: "",
		firstName: "New Subscriber",
		pageTitle: "Subscribe Form",
		contactFormType: "Subscribe",
	});

	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/submit-form", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: formData.email,
					firstName: "New Subscriber",
					pageTitle: "Subscribe Form",
					contactFormType: "Subscribe",
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setIsSubmitted(true);
				setFormData({
					email: "",
					firstName: "New Subscriber",
					pageTitle: "Subscribe Form",
					contactFormType: "Subscribe",
				});
			} else {
				setMessage(
					data.message || "Something went wrong. Please try again."
				);
			}
		} catch (error) {
			setMessage("Something went wrong. Please try again.");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-[1220px] mx-auto bg-[var(--alembic-black)] xl:p-20 lg:p-15 md:p-10 sm:p-8 p-5 min-h-135 flex flex-col justify-between md:my-32 my-10">
			<h2 className="xl:text-[64px] lg:text-5xl md:text-4xl text-4xl max-w-180 leading-18 font-normal text-white mb-20">
				{props.data?.text}
			</h2>
			<form
				onSubmit={handleSubmit}
				className="flex py-5 xl:flex-nowrap lg:flex-nowrap md:flex-nowrap gap-5 flex-wrap border-b-2 border-[#ffffff6b]"
			>
				<input
					type="email"
					placeholder="Sign up for our monthly newsletter"
					name="email"
					id="email"
					value={
						isSubmitted
							? "Thank you for signing up to our newsletter!"
							: formData.email
					}
					onChange={handleChange}
					className={`w-full basis-4/4 ${isSubmitted ? "text-[var(--alembic-purple)]" : "text-white"} xl:text-2xl lg:text-2xl md-text-2xl sm:text-1xl text-[16px] placeholder-white focus:outline-0 bg-transparent`}
					disabled={isSubmitted}
					required
				/>
				<button
					type="submit"
					disabled={isSubmitting || isSubmitted}
					className="text-white p-2 border border-white border-1 rounded px-10 disabled:opacity-50"
				>
					{isSubmitting
						? "Subscribing..."
						: isSubmitted
							? "Subscribed!"
							: "SUBSCRIBE"}
				</button>
			</form>
			{message && <p className="mt-4 text-red-600">{message}</p>}
		</div>
	);
}
