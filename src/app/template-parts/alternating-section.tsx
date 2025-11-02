import { urlFor } from "../utility-functions";
import { PortableText, type SanityDocument } from "next-sanity";
// import { headers } from "next/headers";
// import Button from "../components/Button";
import Image from "next/image";

export async function AlternatingSection(props: { data: SanityDocument }) {
	return (
		<div className="bg-[#F5FAFF] mt-20 py-20 -mb-40">
			<div className="alt-section max-w-[1220px] m-auto">
				<h1
					className="h1 text-center"
					dangerouslySetInnerHTML={{
						__html: props?.data?.title || "",
					}}
				/>
				<section className="pt-20">
					{props?.data?.alternatingSectionsContent.map(
						(item: SanityDocument, index: number) =>
							item && (
								<div
									key={item._key || index}
									className="grid md:grid-cols-2 gap-12 items-center mb-24"
								>
									{index % 2 === 0 ? (
										<>
											<div className="space-y-6 max-w-[540px] m-auto order-2 md:order-1">
												{item?.icon && (
													<Image
														src={
															urlFor(
																item?.icon
															)?.url() ?? ""
														}
														alt=""
														width={24}
														height={24}
													></Image>
												)}
												<h4 className="min-h-[70px] md:text-[32px] text-[26px] leading-[32px] font-medium mt-2">
													{item.title}
												</h4>
												<div className="max-w-[435px]">
													<PortableText
														value={item.body}
													/>
												</div>
											</div>

											<div className="order-1 md:order-2">
												<Image
													src={
														urlFor(
															item?.image
														)?.url() ?? ""
													}
													alt=""
													fill
													className="w-full object-cover !relative"
												></Image>
											</div>
										</>
									) : (
										<>
											<div>
												<Image
													src={
														urlFor(
															item?.image
														)?.url() ?? ""
													}
													alt=""
													fill
													className="w-full object-cover !relative"
												></Image>
											</div>

											<div className="space-y-6 max-w-[540px] m-auto">
												{item?.icon && (
													<Image
														src={
															urlFor(
																item?.icon
															)?.url() ?? ""
														}
														alt=""
														width={24}
														height={24}
													></Image>
												)}
												<h4 className="min-h-[70px] md:text-[32px] text-[26px] leading-[32px] font-medium mt-2">
													{item.title}
												</h4>
												<div className="max-w-[435px]">
													<PortableText
														value={item.body}
													/>
												</div>
											</div>
										</>
									)}
								</div>
							)
					)}
				</section>
			</div>
		</div>
	);
}
