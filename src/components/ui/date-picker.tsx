import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "@//lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type ClassNames, getDefaultClassNames } from "react-day-picker"

type DatePickerProps = {
	date: Date
	setDate: (day: Date | undefined) => void
	classNames?: ClassNames
	className?: string
}

function DatePicker({
	date,
	setDate,
	classNames = { ...getDefaultClassNames(), month: "h-[350px]" },
	className
}: DatePickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					// variant={"outlined"}
					size="sm"
					color="info"
					className={cn(
						"w-[200px] justify-start border-2 border-black gap-2 !bg-white text-left font-normal",
						!date && "text-muted-foreground",
						className
					)}
					onClick={(e) => e.stopPropagation()}
				>
					<CalendarIcon className="size-4" />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
					classNames={classNames}
				/>
			</PopoverContent>
		</Popover>
	)
}

export { DatePicker, type DatePickerProps }
