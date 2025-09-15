export const cookieOptions = {
	path: "/",
	maxAge: 3 * 24 * 60 * 60,
	sameSite: "strict",
	secure: process.env.NEXT_PUBLIC_NODE_ENV === "production"
}

// utils/formData.ts
export function convertToFormData<T>(payload: T): FormData {
	const formData = new FormData()

	for (const key in payload) {
		if (!Object.prototype.hasOwnProperty.call(payload, key)) continue

		const value = payload[key]

		// Skip null, undefined, and empty strings
		if (value === null || value === undefined || value === "") continue

		if (value instanceof File) {
			formData.append(key, value)
		} else {
			formData.append(key, String(value))
		}
	}

	return formData
}
