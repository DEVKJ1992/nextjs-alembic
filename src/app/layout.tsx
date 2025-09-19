import siteSettings from "./site-settings";
import { Inter, Chivo_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Metadata } from "next";
import Navbar from "./template-parts/navbar";
import Footer from "./template-parts/footer";
import Script from "next/script";
import DraftModeProvider from "./components/DraftModeProvider";
import { Suspense } from "react";
import TermlyCMP from "./components/TermlyCMP";
import { urlFor } from "./utility-functions";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const siteSettingsData = await siteSettings();
const WEBSITE_UUID = "0c48e1cf-a40f-4c4b-924e-2e8dde4a1b1b";
const siteLogoUrl = urlFor(siteSettingsData?.siteSettings?.logo)?.url();

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const chivoMono = Chivo_Mono({
	variable: "--font-chivo-mono",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const architekt = localFont({
	variable: "--font-architekt",
	src: "../../public/fonts/NBArchitektStd-Regular.woff2",
	display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
	const siteSettings = siteSettingsData?.siteSettings;
	const seo = siteSettings?.seo;

	const metaTitle = seo?.metaTitle ?? "Alembic";
	const metaDescription = seo?.metaDescription ?? "";
	const metaImage = urlFor(seo?.metaImage)?.url() ?? "";
	const faviconUrl = urlFor(siteSettings?.favicon)?.url() ?? "";

	return {
		title: {
			default: metaTitle,
			template: `%s`,
		},
		description: metaDescription,
		keywords: seo?.metaKeywords,
		icons: {
			icon: faviconUrl,
		},
		openGraph: {
			title: metaTitle,
			description: metaDescription,
			url: "https://getalembic.com",
			siteName: "Alembic",
			images: [
				{
					url: metaImage,
					width: 1200,
					height: 630,
					alt: metaTitle,
				},
			],
			locale: "en_US",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: metaTitle,
			description: metaDescription,
			images: [metaImage],
		},
		alternates: {
			canonical: "https://getalembic.com",
		},
		generator: "Next.js",
		other: {
			"google-site-verification": [
				"cdAUof_eOc9a5TG_1WqPTq30FgHbg89LqRjEYeHgu9s",
				"h_pzvbeDfGbWYUwHj97Rd0ed82BWMBis2gpRyKbMam4",
			],
		},
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<Script
					type="text/javascript"
					src="https://app.termly.io/resource-blocker/0c48e1cf-a40f-4c4b-924e-2e8dde4a1b1b?autoBlock=on"
				></Script>
				{/* Google Analytics */}
				<Script
					strategy="afterInteractive"
					src="https://www.googletagmanager.com/gtag/js?id=UA-131483738-2"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'UA-131483738-2');
          `}
				</Script>

				{/* Google Tag Manager */}
				<Script id="google-tag-manager" strategy="afterInteractive">
					{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NNPZJ9M');
          `}
				</Script>
			</head>
			<body
				className={`${architekt.variable} ${chivoMono.variable} ${inter.variable} antialiased`}
			>
				<Suspense fallback={<div>Loading...</div>}>
					<TermlyCMP
						autoBlock={true}
						masterConsentsOrigin="https://getalembic.com"
						websiteUUID={WEBSITE_UUID}
					/>
				</Suspense>
				{/* Google Tag Manager (noscript) */}
				<noscript>
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-NNPZJ9M"
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
					></iframe>
				</noscript>
				<Navbar
					logoUrl={siteLogoUrl ?? ""}
					nav={siteSettingsData?.siteSettings?.menuItems}
				/>

				<div className="bg-white pt-12">
					<DraftModeProvider>{children}</DraftModeProvider>
				</div>

				<Footer
					logoUrl={siteLogoUrl ?? ""}
					footerNav={siteSettingsData?.siteSettings?.footerMenuItems}
					legalNav={siteSettingsData?.siteSettings?.footerLegalItems}
				/>

				{/* <script
					type="text/javascript"
					src="https://www.bugherd.com/sidebarv2.js?apikey=fzmekitbjn4hgu4u3ze0xa"
					async={true}
				></script> */}
			</body>
		</html>
	);
}
