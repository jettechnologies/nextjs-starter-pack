import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type GlobalStatus =
	| "success"
	| "successful"
	| "active"
	| "pending"
	| "unverified"
	| "verified"
	| "failed"
	| "declined"

interface StatusProps {
	dot?: boolean
	width?: string
	active?: boolean
	onClick?: () => void
	status: GlobalStatus
}

const getStatusStyles = (status: GlobalStatus) => {
	switch (status) {
		case "success":
		case "successful":
		case "active":
			return "bg-green-100 text-green-700 border border-green-700"
		case "pending":
			return "bg-yellow-100 text-yellow-600 border border-yellow-600"
		case "unverified":
			return "bg-orange-100 text-orange-700 border border-orange-700"
		case "verified":
			return "bg-purple-100 text-purple-700 border border-purple-700"
		case "failed":
		case "declined":
			return "bg-red-100 text-red-700 border border-red-700"
		default:
			return "bg-gray-100 text-gray-500 border border-gray-500"
	}
}

export function StatusBadge({
	width,
	status,
	dot = false,
	active = false,
	onClick
}: StatusProps) {
	const styles = getStatusStyles(status)
	const label = status.includes("_")
		? status.replaceAll("_", " ").toLowerCase()
		: status

	return (
		<Badge
			onClick={onClick}
			className={cn(
				"flex h-6 items-center justify-center gap-1 rounded-md px-2 text-xs font-normal capitalize cursor-pointer",
				styles,
				width ? `w-[${width}]` : "w-[85px]",
				dot && "justify-start px-1",
				active ? "ring-2 ring-offset-1" : ""
			)}
		>
			{dot && (
				<span
					className="mx-1 h-1.5 w-1.5 rounded-full"
					style={{ backgroundColor: "currentColor" }}
				/>
			)}
			{label}
		</Badge>
	)
}
