import Link from "next/link";

interface ButtonProps {
	href: string | undefined;
	className?: string;
	variant: "primary" | "secondary";
	children: React.ReactNode;
	noIcon?: boolean;
	externalLink?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	href,
	className,
	children,
	variant,
	noIcon,
	externalLink,
}) => {
	const buttonClass = variant === "primary" ? "btn-primary" : "btn-secondary";
	const widthClass = variant === "primary" ? "px-10" : "px-8";
	const arrow = !noIcon ? (variant === "secondary" ? "↓" : ">") : "";

	return (
		<Link
			href={href || ""}
			target={externalLink ? "_blank" : "_self"}
			className={`${widthClass} w-full md:w-max flex justify-center items-center uppercase h-[53px] btn-al ${buttonClass} ${
				className || ""
			}`}
		>
			{children} {arrow}
		</Link>
	);
};

export default Button;
