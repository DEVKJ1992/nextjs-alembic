import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Error 404 - Page Not Found | Alembic",
	};
}

export default async function NotFoundPage() {
	return (
		<div className="flex flex-col gap-[6px] h-full min-h-screen justify-center">
			<svg
				width="60"
				height="60"
				viewBox="0 0 60 60"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="mx-auto"
			>
				{/* Circle */}
				<path
					d="M54.625 30.5C54.625 35.1726 53.2394 39.7402 50.6435 43.6253C48.0475 47.5105 44.3578 50.5385 40.0409 52.3267C35.724 54.1148 30.9738 54.5826 26.391 53.671C21.8082 52.7595 17.5986 50.5094 14.2946 47.2054C10.9906 43.9014 8.74053 39.6918 7.82896 35.109C6.91738 30.5262 7.38524 25.776 9.17336 21.4591C10.9615 17.1422 13.9896 13.4525 17.8747 10.8565C21.7598 8.26058 26.3274 6.875 31 6.875C37.2636 6.88188 43.2688 9.37314 47.6978 13.8022C52.1269 18.2313 54.6181 24.2364 54.625 30.5ZM52.735 30.5C52.735 26.2012 51.4603 21.999 49.072 18.4247C46.6837 14.8504 43.2892 12.0645 39.3176 10.4195C35.3461 8.77441 30.9759 8.34398 26.7597 9.18263C22.5435 10.0213 18.6707 12.0913 15.631 15.131C12.5913 18.1707 10.5213 22.0435 9.68264 26.2597C8.84399 30.4759 9.27442 34.8461 10.9195 38.8176C12.5646 42.7892 15.3504 46.1837 18.9247 48.572C22.499 50.9603 26.7012 52.235 31 52.235C36.7626 52.2287 42.2873 49.9368 46.3621 45.8621C50.4368 41.7873 52.7288 36.2626 52.735 30.5Z"
					fill="#8B71F6"
				/>
				{/* X mark */}
				<path
					d="M24 22L38 38M38 22L24 38"
					stroke="#8B71F6"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<h3 className="text-[var(--alembic-black)] font-semibold text-center p-0">
				404
			</h3>
			<h4 className="uppercase text-[var(--alembic-purple)] text-[16px] text-center tracking-[1.4px] architekt font-normal">
				Page Not Found
			</h4>
			<Link
				href="/"
				className="text-[var(--alembic-black)] text-[18px] text-center mt-5"
			>
				← Go to home
			</Link>
			<Link
				href="/contact"
				className="text-[#757575] text-[14px] text-center mt-5"
			>
				If you followed a link here, please tell us →
			</Link>
		</div>
	);
}
