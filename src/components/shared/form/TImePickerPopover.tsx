import { TimePicker } from "./TimePicker"
import {
	Popover,
	PopoverTrigger,
	PopoverContent
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"
import { Controller } from "react-hook-form"
import { type FieldValues, type Path, type Control } from "react-hook-form"

interface TimePickerPopoverProps<T extends FieldValues> {
	name: Path<T>
	control: Control<T>
	selectedTime?: string
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
	triggerClassName?: string
}

export const TimePickerPopover = <T extends FieldValues>({
	name,
	control,
	selectedTime,
	isOpen,
	onOpen,
	onClose,
	triggerClassName
}: TimePickerPopoverProps<T>) => {
	const formatDisplayTime = (time24: string) => {
		if (!time24) return "Select time"
		const [hours, minutes] = time24.split(":")
		const hour = parseInt(hours)
		const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
		return `${displayHour}:${minutes}`
	}
	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<Popover
					open={isOpen}
					onOpenChange={(open) => (open ? onOpen() : onClose())}
				>
					<PopoverTrigger asChild className={cn("w-full", triggerClassName)}>
						<button type="button" className="flex items-center gap-2">
							<Clock className="w-4 h-4" />
							<span>
								{selectedTime ? formatDisplayTime(selectedTime) : "Select time"}
							</span>
						</button>
					</PopoverTrigger>
					<PopoverContent>
						<TimePicker
							value={field.value}
							onChange={field.onChange}
							onClose={onClose}
						/>
					</PopoverContent>
				</Popover>
			)}
		/>
	)
}
