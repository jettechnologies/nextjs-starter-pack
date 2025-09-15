// lib/query-client.ts
import { QueryClient, QueryKey, MutationCache } from "@tanstack/react-query"
import { toast } from "sonner"

declare module "@tanstack/react-query" {
	interface Register {
		mutationMeta: {
			invalidatesQuery?: QueryKey
			successMessage?: string
			errorMessage?: string
		}
	}
}

export function makeQueryClient() {
	return new QueryClient({
		mutationCache: new MutationCache({
			onSuccess: (_data, _variables, _context, mutation) => {
				if (mutation.meta?.successMessage) {
					toast.success(mutation.meta?.successMessage)
				}
			},
			onError: (_error, _variables, _context, mutation) => {
				let message: string | undefined

				if (_error instanceof Error && _error.message) {
					message = _error.message
				}
				if (!message && mutation.meta?.errorMessage) {
					message = mutation.meta.errorMessage
				}
				if (!message) {
					message = "An unexpected error occurred."
				}

				toast.error(message)
			},
			onSettled: (_data, _error, _variables, _context, mutation) => {
				if (mutation.meta?.invalidatesQuery) {
					// Get the current query client instance
					const queryClient = getQueryClient()
					queryClient.invalidateQueries({
						queryKey: mutation.meta?.invalidatesQuery
					})
				}
			}
		}),
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5,
				gcTime: 5 * 60 * 1000,
				refetchOnWindowFocus: false,
				retry: (failureCount, error) => {
					// Don't retry on auth errors
					if (
						error instanceof Error &&
						error.message.includes("Authorization")
					) {
						return false
					}
					return failureCount < 3
				}
			}
		}
	})
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return makeQueryClient()
	} else {
		// Browser: make a new query client if we don't already have one
		if (!browserQueryClient) {
			browserQueryClient = makeQueryClient()
		}
		return browserQueryClient
	}
}
