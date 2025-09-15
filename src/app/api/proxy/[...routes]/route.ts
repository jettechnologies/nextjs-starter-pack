import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// Base URL of your backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_DLC_LIVE_URL
	? `${process.env.NEXT_PUBLIC_DLC_LIVE_URL}/v1/admin`
	: "https://your-backend.com"

async function handleRequest(req: NextRequest, method: string) {
	const cookieStore = await cookies()
	const token = cookieStore.get("session")?.value

	if (!token) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 }
		)
	}

	// Extract the path after /api/proxy/*
	const path = req.nextUrl.pathname.replace(/^\/api\/proxy/, "")
	const targetUrl = `${API_BASE_URL}${path}${req.nextUrl.search}`

	// Clone headers
	const headers: HeadersInit = {
		Authorization: `Bearer ${token}` // Attach token
	}

	// Detect Content-Type from original request
	const contentType = req.headers.get("content-type") || ""

	let body: BodyInit | undefined
	if (["POST", "PATCH", "PUT"].includes(method)) {
		if (contentType.includes("application/json")) {
			headers["Content-Type"] = "application/json"
			body = await req.text() // JSON body as-is
		} else if (contentType.includes("multipart/form-data")) {
			const formData = await req.formData()
			body = formData // Pass FormData directly
			// Don't set Content-Type manually → fetch will handle boundary headers
		} else if (contentType.includes("application/x-www-form-urlencoded")) {
			headers["Content-Type"] = "application/x-www-form-urlencoded"
			body = await req.text()
		} else {
			// Default fallback
			body = await req.text()
		}
	}

	// Forward request
	const response = await fetch(targetUrl, {
		method,
		headers,
		body
	})

	// Some backend responses might not always be JSON (e.g., file downloads)
	const contentTypeRes = response.headers.get("content-type") || ""
	if (contentTypeRes.includes("application/json")) {
		const responseData = await response.json()
		return NextResponse.json(responseData, { status: response.status })
	} else {
		const buffer = await response.arrayBuffer()
		return new NextResponse(buffer, {
			status: response.status,
			headers: response.headers
		})
	}
}

// Handle GET, POST, PATCH, DELETE
export async function GET(req: NextRequest) {
	return handleRequest(req, "GET")
}

export async function POST(req: NextRequest) {
	return handleRequest(req, "POST")
}

export async function PATCH(req: NextRequest) {
	return handleRequest(req, "PATCH")
}

export async function PUT(req: NextRequest) {
	return handleRequest(req, "PUT")
}

export async function DELETE(req: NextRequest) {
	return handleRequest(req, "DELETE")
}
