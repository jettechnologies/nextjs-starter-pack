import { queryKeys } from "@/services/query-keys"
import {
	dehydrate,
	QueryClient,
	DehydratedState,
	Query,
	FetchQueryOptions
} from "@tanstack/react-query"

// Define a type for your query keys - arrays of strings or numbers
type QueryKey = readonly (string | number)[]

// Utility to get query options to prefetch and dehydrate selectively
export function getCustomQueryOptions(keys: QueryKey[]) {
	return keys.map((key) => ({
		queryKey: key,
		staleTime: 1000 * 60 * 5 // customize based on freshness needs
	}))
}

// Selectively prefetch and dehydrate needed queries
export async function prefetchAndDehydrateQueries(
	queryClient: QueryClient,
	keysToFetch: QueryKey[]
): Promise<DehydratedState> {
	// Prefetch expects options, not just keys, so build options here
	for (const key of keysToFetch) {
		const options: FetchQueryOptions = { queryKey: key }
		await queryClient.prefetchQuery(options)
	}

	// Dehydrate only queries matching these keys
	const dehydrated = dehydrate(queryClient, {
		shouldDehydrateQuery: (query: Query) => {
			if (!Array.isArray(query.queryKey)) return false

			// Check if any key in keysToFetch is a prefix of the query's key
			return keysToFetch.some(
				(fetchKey) =>
					fetchKey.length <= query.queryKey.length &&
					fetchKey.every((k, i) => query.queryKey[i] === k)
			)
		}
	})

	return dehydrated
}

// import { queryKeys } from "@/services/query-keys"
// import { dehydrate, QueryClient, DehydratedState } from "@tanstack/react-query"

// // import your queryKeys

// // Utility to get query options to prefetch and dehydrate selectively
// export function getCustomQueryOptions(
// 	keys: Array<ReturnType<(typeof queryKeys)[keyof typeof queryKeys]["all"]>>
// ) {
// 	return keys.map((key) => ({
// 		queryKey: key,
// 		staleTime: 1000 * 60 * 5 // customize based on freshness needs
// 	}))
// }

// // Selectively prefetch and dehydrate needed queries
// export async function prefetchAndDehydrateQueries(
// 	queryClient: QueryClient,
// 	keysToFetch: Array<
// 		ReturnType<(typeof queryKeys)[keyof typeof queryKeys]["all"]>
// 	>
// ): Promise<DehydratedState> {
// 	// Prefetch only the specified queries
// 	for (const key of keysToFetch) {
// 		await queryClient.prefetchQuery(key)
// 	}

// 	// Dehydrate only queries matching these keys
// 	const dehydrated = dehydrate(queryClient, {
// 		shouldDehydrateQuery: (query) => {
// 			// Check if the query's key starts with any of the keysToFetch prefixes (handle nested keys with arrays)
// 			return keysToFetch.some((fetchKey) =>
// 				Array.isArray(query.queryKey) && Array.isArray(fetchKey)
// 					? fetchKey.every((k, i) => query.queryKey[i] === k)
// 					: query.queryKey === fetchKey
// 			)
// 		}
// 	})

// 	return dehydrated
// }
