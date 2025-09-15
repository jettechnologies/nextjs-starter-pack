/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertToFormData } from "@/utils/misc"

// import { useUserAuthStore } from "@store/auth-store"

// export interface EncryptionResult {
// 	encryptedData: string
// 	iv: string
// }

export interface StandardResponse<T = any> {
	success: boolean
	message: string
	status: number
	payload: T
	errors?: any[]
}

export interface PaginatedResponse<T> {
	data: T
	total: number
	currentPage: number
	pageSize: number
}

// type BaseUrlType = "auth" | "admin"

// export class EncryptionUtils {
// 	// Check if object looks encrypted
// 	static isEncrypted(data: any): boolean {
// 		return (
// 			data &&
// 			typeof data === "object" &&
// 			"encryptedData" in data &&
// 			"iv" in data &&
// 			typeof data.encryptedData === "string" &&
// 			typeof data.iv === "string"
// 		)
// 	}

// 	// Check if response payload looks encrypted
// 	static hasEncryptedPayload(response: StandardResponse): boolean {
// 		return response.payload && this.isEncrypted(response.payload)
// 	}
// }

class ApiService {
	private baseUrl: string

	// constructor(type: BaseUrlType = "admin") {
	// 	const BASE_URLS = {
	// 		admin: `${import.meta.env.VITE_API_BASE_URL}/admin`,
	// 		auth: `${import.meta.env.VITE_API_BASE_URL}/v1/admin`
	// 	}

	// 	this.baseUrl = BASE_URLS[type] || "http://localhost:3000"
	// }

	constructor() {
		this.baseUrl = "/api/proxy"
	}

	private getHeaders(): HeadersInit {
		return {
			// Authorization: `Bearer ${useUserAuthStore.getState().token || ""}`
			Authorization: `Bearer ${(localStorage.getItem("session") as string) || ""}`
		}
	}

	private isStandardResponse(data: any): boolean {
		return (
			data &&
			typeof data === "object" &&
			"success" in data &&
			"message" in data &&
			"status" in data
		)
	}

	async makeRequest<T = any>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<StandardResponse<T>> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			...options,
			headers: {
				...this.getHeaders(),
				...options.headers
			}
		})

		if (!response.ok) {
			const errData = await response.json().catch(() => null)
			throw new Error(
				errData?.message || `HTTP ${response.status}: ${response.statusText}`
			)
		}

		const data = await response.json()

		if (!this.isStandardResponse(data)) {
			throw new Error("Unexpected response format")
		}

		// if (EncryptionUtils.hasEncryptedPayload(data)) {
		// 	throw new Error(
		// 		"Encrypted payload received — backend should decrypt before sending."
		// 	)
		// }

		return data as StandardResponse<T>
	}

	async post<T = any, D = any>(
		endpoint: string,
		data: D,
		useFormData = false
	): Promise<StandardResponse<T>> {
		const body = useFormData ? convertToFormData(data) : JSON.stringify(data)

		return this.makeRequest<T>(endpoint, {
			method: "POST",
			headers: useFormData
				? { "Content-Type": "multipart/form-data" }
				: { "Content-Type": "application/json" },
			body
		})
	}

	async get<T = any>(
		endpoint: string,
		params?: Record<string, string>,
		signal?: AbortSignal
	): Promise<StandardResponse<T>> {
		// const url = new URL(`${this.baseUrl}${endpoint}`);
		// if (params) {
		//   Object.entries(params).forEach(([key, value]) => {
		//     url.searchParams.append(key, value);
		//   });
		// }

		// return this.makeRequest<T>(url.pathname + url.search, {
		//   method: "GET",
		// });

		let finalEndpoint = endpoint

		if (params) {
			const queryString = new URLSearchParams(params).toString()
			finalEndpoint += `?${queryString}`
		}

		return this.makeRequest<T>(finalEndpoint, {
			method: "GET",
			signal
		})
	}

	async put<T = any, D = any>(
		endpoint: string,
		data: D,
		useFormData = false
	): Promise<StandardResponse<T>> {
		const body = useFormData ? convertToFormData(data) : JSON.stringify(data)

		return this.makeRequest<T>(endpoint, {
			method: "PUT",
			headers: useFormData
				? { "Content-Type": "multipart/form-data" }
				: { "Content-Type": "application/json" },
			body
		})
	}

	async delete<T = any>(endpoint: string): Promise<StandardResponse<T>> {
		return this.makeRequest<T>(endpoint, {
			method: "DELETE"
		})
	}
}

export const apiService = new ApiService()
