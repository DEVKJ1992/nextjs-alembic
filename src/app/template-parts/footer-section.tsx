import Button from "../components/Button";

export default function FooterSection(props: {
	title: string;
	body: string;
	ctaText: string;
	ctaUrl: string;
	titleSm?: boolean;
}) {
	return (
		<div className="footer-section second-banner-bg bg-[url(/images/ft-bg.jpg)] bg-center bg-no-repeat bg-cover force-mobile-bg">
			<div className="banner max-w-[1220px] mx-auto py-36 xl:px-0 px-5">
				<div className="col max-w-[1113px]">
					<h3
						className={`${props.titleSm ? "md:text-[66px] md:leading-[72px]" : "xl:text-[96px] lg:text-[80px] md:text-[60px] xl:leading-[92px] lg:leading-[92px]"} text-[40px] text-[var(--alembic-black)] leading-[45px]`}
					>
						{props.title}
					</h3>
					<p
						className="max-w-[590px] my-4"
						dangerouslySetInnerHTML={{ __html: props?.body || "" }}
					/>
					<div className="btn-col max-w-[570px] flex flex-row flex-wrap gap-3">
						<Button href={props.ctaUrl} variant="primary">
							{props.ctaText}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
