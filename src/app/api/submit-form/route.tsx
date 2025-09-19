import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sparkPostTransport from "nodemailer-sparkpost-transport";
import { client } from "@/sanity/client";
import fetch from "node-fetch";

interface FormData {
	firstName: string;
	lastName: string;
	companyName: string;
	email: string;
	phone: string;
	country: string;
	how: string;
	contactFormType: string;
	url?: string;
	pageTitle: string;
	whitepaperUrl?: string;
	turnstileToken: string;
}

async function verifyTurnstileCaptcha(
	captchaResponse: string
): Promise<boolean> {
	const turnstileSecret = "0x4AAAAAABC4ENbSHLu9O8yQiBrBDcU1ws0"; // Your secret key from Turnstile
	const response = await fetch(
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		{
			method: "POST",
			body: new URLSearchParams({
				secret: turnstileSecret,
				response: captchaResponse,
			}),
		}
	);

	const result = (await response.json()) as { success: boolean };
	return result.success; // returns true if the CAPTCHA was validated successfully
}

export async function POST(request: Request) {
	const formData: FormData = await request.json();
	const {
		firstName,
		lastName,
		companyName,
		email,
		phone,
		country,
		how,
		contactFormType,
		url,
		pageTitle,
		whitepaperUrl,
		turnstileToken,
	} = formData;

	const isCaptchaValid = await verifyTurnstileCaptcha(turnstileToken);

	if (contactFormType !== "Subscribe" && !isCaptchaValid) {
		return NextResponse.json(
			{ message: "Invalid CAPTCHA. Please try again." },
			{ status: 400 }
		);
	}

	const sparkPostApiKey = process.env.SPARKPOST_API_KEY;
	const sparkPostSenderEmail = process.env.SPARKPOST_SENDER_EMAIL;

	if (!sparkPostApiKey || !sparkPostSenderEmail) {
		return NextResponse.json(
			{ message: "Missing SparkPost API key or sender email." },
			{ status: 500 }
		);
	}

	// Configure nodemailer transporter with SparkPost
	const transporter = nodemailer.createTransport(
		sparkPostTransport({
			sparkPostApiKey: sparkPostApiKey, // Your SparkPost API key
		})
	);

	try {
		// Fetch the file content from the URL
		let base64FileContent;
		if (whitepaperUrl) {
			const response = await fetch(whitepaperUrl);
			if (!response.ok) {
				throw new Error(
					`Failed to fetch file from URL: ${response.statusText}`
				);
			}
			const fileContent = await response.arrayBuffer();
			base64FileContent = Buffer.from(fileContent).toString("base64");
		}

		// Email content
		let mailOptions;
		if (
			(contactFormType === "Case-Study" || contactFormType === "Whitepaper") &&
			base64FileContent
		) {
			mailOptions = {
				from: sparkPostSenderEmail, // Sender email address from environment variables
				to: email,
				subject: `${pageTitle}`,
				text: `Dear ${firstName} ${lastName},\n\nThank you for requesting "${pageTitle}". Please find the attachment below.\n\nBest regards,\nThe Alembic Team`,
				attachments: [
					{
						filename: `${pageTitle}.pdf`, // Replace with the actual file name
						content: base64FileContent, // Base64 encoded file content
						contentType: "application/pdf",
					},
				],
			};
		} else if (
			(contactFormType === "Whitepaper" || contactFormType === "Case-Study") &&
			url
		) {
			mailOptions = {
				from: sparkPostSenderEmail, // Sender email address from environment variables
				to: email,
				subject: `${pageTitle}`,
				text: `Dear ${firstName} ${lastName},\n\nThank you for requesting "${pageTitle}".\n\nHere is the link: ${url}.\n\nBest regards,\nThe Alembic Team`,
			};
		} else {
			mailOptions = {
				from: sparkPostSenderEmail, // Sender email address from environment variables
				to: email,
				subject: `${pageTitle}`,
				text: `Dear ${firstName} ${lastName},\n\nThank you for contacting us through "${pageTitle}" Form.\n\nWe will get back to you as soon as possible.\n\nBest regards,\nThe Alembic Team`,
			};
		}

		const adminMailOptions = {
			from: sparkPostSenderEmail,
			to: "website-leads@twothink.co", // Admin email address from environment variables
			subject: `New Contact for ${contactFormType}: ${pageTitle}`,
			text: `You have a new contact for ${contactFormType}!\n\nForm Data:\n
				First Name: ${firstName}\n
				Last Name: ${lastName}\n
				Company: ${companyName}\n
				Email: ${email}\n
				Country: ${country}\n
				Phone: ${phone}\n
				How Did You Hear About Us: ${how}\n
				Page Title: ${pageTitle}\n\n
				Best regards,\nThe Alembic Team`,
		};

		if (mailOptions && contactFormType !== "Subscribe") {
			await transporter.sendMail(mailOptions);
			await transporter.sendMail(adminMailOptions);
		} else if (contactFormType !== "Subscribe") {
			return NextResponse.json({
				message: "Error sending email, Please try again!",
			});
		}

		const submission = {
			_type: "formSubmissions",
			firstName,
			lastName,
			companyName,
			email,
			phone,
			country,
			how,
			contactFormType,
			pageTitle,
			timestamp: new Date().toISOString(),
		};

		await client.create(submission);

	if (contactFormType !== "Subscribe") {
		const slackWebhookUrl =
			"https://hooks.slack.com/services/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";

		const slackMessage = `New contact form submission:
		*First Name:* ${firstName}
		*Last Name:* ${lastName}
		*Email:* ${email}
		*Company Name:* ${companyName}
		*Phone:* ${phone}
		*Country:* ${country}
		*How did you hear about Alembic:* ${how}
		*Page Title:* ${pageTitle}
		*Contact Form Type:* ${contactFormType}
		*Timestamp:* ${new Date().toISOString()}
		`;

		try {
			const response = await fetch(slackWebhookUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: slackMessage }),
			});

			if (!response.ok) {
				return console.error("Failed to send message to Slack");
			}

			console.log("Message sent to Slack successfully!");
		} catch (error) {
			console.error(error);
		}
	}

		return NextResponse.json({
			message: "Emails sent and data saved to Sanity successfully!",
		});
	} catch (error) {
		console.error("Error sending message:", JSON.stringify(error));

		return NextResponse.json(
			{ message: "Failed to send message." },
			{ status: 500 }
		);
	}
}
