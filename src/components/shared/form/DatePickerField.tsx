import { EnhancedForm } from "../enhanced-form"
import { DatePicker, type DatePickerProps } from "@/components/ui/date-picker"
import { type FieldValues, type Path, type Control } from "react-hook-form"

type DatePickerFieldProps<T extends FieldValues> = Omit<
	DatePickerProps,
	"date" | "setDate"
> & {
	control: Control<T>
	name: Path<T>
	label?: string
	labelClassName?: string
	className?: string
}

export function DatePickerField<T extends FieldValues>({
	control,
	name,
	label,
	labelClassName,
	className,
	...props
}: DatePickerFieldProps<T>) {
	return (
		<EnhancedForm.Field
			control={control}
			name={name}
			label={label}
			labelClassName={labelClassName}
			render={(field) => (
				<DatePicker
					{...field}
					{...props}
					date={field.value}
					setDate={(selectedDate) => field.onChange(selectedDate)}
					className={className}
				/>
			)}
		/>
	)
}
