"use client";

import { Suspense } from "react";

type DraftModeProviderProps = {
	children: React.ReactNode;
};

function DraftModeComponent({ children }: DraftModeProviderProps) {
	// We're still tracking draft mode state in case it's needed elsewhere,
	// but not showing any UI for it
	return <>{children}</>;
}

export default function DraftModeProvider({
	children,
}: DraftModeProviderProps) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DraftModeComponent>{children}</DraftModeComponent>
		</Suspense>
	);
}
