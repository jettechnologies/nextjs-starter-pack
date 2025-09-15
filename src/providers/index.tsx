"use client"

import { getQueryClient } from "@/utils/lib/tanstack-query/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { useState, ReactNode } from "react"
import { Toaster } from "sonner"

export function Providers({ children }: { children: ReactNode }) {
	// Use the optimized query client pattern
	const [queryClient] = useState(() => getQueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<Toaster richColors />
		</QueryClientProvider>
	)
}
