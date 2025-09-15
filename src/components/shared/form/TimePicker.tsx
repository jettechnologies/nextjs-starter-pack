"use client"

import { Clock } from "lucide-react"
import { useState } from "react"

interface TimePickerProps {
	value: string
	onChange: (value: string) => void
	onClose: () => void
}

type TimeVariant = "AM" | "PM"

export const TimePicker = ({ value, onChange, onClose }: TimePickerProps) => {
	const [hour, setHour] = useState(value ? parseInt(value.split(":")[0]) : 7)
	const [minute, setMinute] = useState(
		value ? parseInt(value.split(":")[1]) : 0
	)
	const [period, setPeriod] = useState<TimeVariant>(
		value && parseInt(value.split(":")[0]) >= 12 ? "PM" : "AM"
	)
	const [mode, setMode] = useState<"hour" | "minute">("hour") // NEW

	const formatTime = (h: number, m: number, p: TimeVariant) => {
		const formattedHour = h.toString().padStart(2, "0")
		const formattedMinute = m.toString().padStart(2, "0")
		return `${formattedHour}:${formattedMinute} ${p}`
	}

	const handleHourChange = (newHour: number) => {
		setHour(newHour)
		onChange(formatTime(newHour, minute, period))
		setMode("minute") // Switch to minute mode after hour selection
	}

	const handleMinuteChange = (newMinute: number) => {
		setMinute(newMinute)
		onChange(formatTime(hour, newMinute, period))
	}

	const handlePeriodChange = (newPeriod: TimeVariant) => {
		setPeriod(newPeriod)
		onChange(formatTime(hour, minute, newPeriod))
	}

	const handleOk = () => {
		onChange(formatTime(hour, minute, period))
		onClose()
	}

	const handleCancel = () => {
		onClose()
	}

	const getClockPosition = (value: number, max: number, radius = 80) => {
		const angle = (value * 360) / max - 90
		const radian = (angle * Math.PI) / 180
		return {
			x: Math.cos(radian) * radius,
			y: Math.sin(radian) * radius
		}
	}

	const hourPosition = getClockPosition(
		hour === 0 ? 12 : hour > 12 ? hour - 12 : hour,
		12
	)
	const minutePosition = getClockPosition(minute, 60, 70)

	return (
		<div className="w-full">
			{/* Header */}
			<div className="text-gray-600 text-sm font-medium mb-4 pb-2 border-b border-gray-200">
				SELECT TIME
			</div>

			{/* Digital Display */}
			<div className="flex items-center justify-center mb-6">
				<div className="flex items-center rounded-lg p-2">
					<div
						className={`text-4xl font-bold px-3 py-2 cursor-pointer rounded ${
							mode === "hour"
								? "bg-purple-200 text-purple-600"
								: "hover:bg-gray-200"
						}`}
						onClick={() => setMode("hour")}
					>
						{hour.toString().padStart(2, "0")}
					</div>
					<div className="text-4xl font-bold text-black px-1">:</div>
					<div
						className={`text-4xl font-bold px-3 py-2 cursor-pointer rounded ${
							mode === "minute"
								? "bg-purple-200 text-purple-600"
								: "hover:bg-gray-200"
						}`}
						onClick={() => setMode("minute")}
					>
						{minute.toString().padStart(2, "0")}
					</div>
				</div>
				<div className="ml-4 flex flex-col">
					<button
						className={`px-3 py-1 text-sm font-medium rounded-t ${
							period === "AM"
								? "bg-purple-100 text-purple-600"
								: "bg-gray-100 text-gray-600"
						}`}
						onClick={() => handlePeriodChange("AM")}
					>
						AM
					</button>
					<button
						className={`px-3 py-1 text-sm font-medium rounded-b ${
							period === "PM"
								? "bg-purple-100 text-purple-600"
								: "bg-gray-100 text-gray-600"
						}`}
						onClick={() => handlePeriodChange("PM")}
					>
						PM
					</button>
				</div>
			</div>

			{/* Clock Face */}
			<div className="flex justify-center mb-6">
				<div className="relative w-48 h-48">
					<svg width="192" height="192" className="absolute inset-0">
						<circle
							cx="96"
							cy="96"
							r="90"
							fill="#f3f4f6"
							stroke="#e5e7eb"
							strokeWidth="2"
						/>

						{/* Dynamic Markers */}
						{mode === "hour"
							? [...Array(12)].map((_, i) => {
									const angle = i * 30 - 90
									const radian = (angle * Math.PI) / 180
									const x = 96 + Math.cos(radian) * 70
									const y = 96 + Math.sin(radian) * 70
									const hourNum = i === 0 ? 12 : i
									return (
										<text
											key={i}
											x={x}
											y={y + 5}
											textAnchor="middle"
											className="text-sm font-medium fill-gray-700 cursor-pointer hover:fill-purple-600"
											onClick={() => handleHourChange(hourNum)}
										>
											{hourNum}
										</text>
									)
								})
							: [...Array(12)].map((_, i) => {
									const minuteValue = i * 5
									const angle = (minuteValue * 360) / 60 - 90
									const radian = (angle * Math.PI) / 180
									const x = 96 + Math.cos(radian) * 70
									const y = 96 + Math.sin(radian) * 70
									return (
										<text
											key={i}
											x={x}
											y={y + 5}
											textAnchor="middle"
											className="text-sm font-medium fill-gray-700 cursor-pointer hover:fill-purple-600"
											onClick={() => handleMinuteChange(minuteValue)}
										>
											{minuteValue.toString().padStart(2, "0")}
										</text>
									)
								})}

						{/* Clock Hands */}
						<line
							x1="96"
							y1="96"
							x2={96 + (mode === "hour" ? hourPosition.x : minutePosition.x)}
							y2={96 + (mode === "hour" ? hourPosition.y : minutePosition.y)}
							stroke="#7c3aed"
							strokeWidth="3"
							strokeLinecap="round"
						/>

						{/* Center dot */}
						<circle cx="96" cy="96" r="8" fill="#7c3aed" />
					</svg>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-between items-center pt-4 border-t border-gray-200">
				<Clock className="w-5 h-5 text-gray-400" />
				<div className="flex space-x-4">
					<button
						onClick={handleCancel}
						className="px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded"
					>
						CANCEL
					</button>
					<button
						onClick={handleOk}
						className="px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded"
					>
						OK
					</button>
				</div>
			</div>
		</div>
	)
}
