"use client"

// Error boundaries must be client components
import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function GlobalError({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const { reset: resetQueryError } = useQueryErrorResetBoundary()
	const [isRetrying, setIsRetrying] = useState(false)

	useEffect(() => {
		console.error("Global Error Boundary Caught:", error)
	}, [error])

	const handleReset = () => {
		setIsRetrying(true)
		resetQueryError()
		reset()
	}

	return (
		<html>
			<body className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-4">
				<div className="max-w-md">
					{/* Illustration fallback */}
					<Image
						src="/error-fallback-illustration.jpg"
						alt="Error Illustration"
						width={300}
						height={300}
						className="mx-auto mb-6"
					/>

					<h2 className="text-lg font-semibold text-red-600 mb-2">
						Something went wrong!
					</h2>
					<p className="text-gray-700 mb-4">{error.message}</p>

					{isRetrying ? (
						<div className="flex flex-col items-center justify-center">
							<svg
								className="animate-spin h-8 w-8 text-blue-600 mb-2"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"
								></path>
							</svg>
							<p className="text-blue-600">Retrying, please wait...</p>
						</div>
					) : (
						<button
							onClick={handleReset}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
						>
							Try Again
						</button>
					)}
				</div>
			</body>
		</html>
	)
}
