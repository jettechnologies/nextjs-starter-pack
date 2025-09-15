/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils"
import React from "react"
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form"
import Select from "react-select"
import makeAnimated from "react-select/animated"

const animatedComponent = makeAnimated()

export interface Option {
	label: string
	value: number | string
	icon?: React.ReactElement
}

type Props<T extends FieldValues> = {
	field: ControllerRenderProps<T, Path<T>>
	value: string | number | Array<string | number> | null | Date
	onChange?: (selectedOption: Option) => void
	placeholder?: string
	textColor?: string
	options: Option[]
	defaultValue?: Option
	menuBg?: string
	menuWidth?: string
	multi?: "yes" | "no"
	height?: string
	fontSize?: string
	borderStyle?: string
	borderRadius?: string
}

const CustomSelect = <T extends FieldValues>({
	field,
	value,
	placeholder,
	textColor,
	options,
	onChange,
	defaultValue,
	menuBg,
	menuWidth,
	multi = "no",
	height = "40px",
	fontSize = "14px",
	borderStyle = "none",
	borderRadius = "0px"
}: Props<T>) => {
	// const id = React.useMemo(() => Date.now().toString(), [])

	const isMulti = multi === "yes"

	const selectedValue = isMulti
		? options.filter((opt) =>
				Array.isArray(value) ? value.includes(opt.value) : false
			)
		: options.find((opt) => opt.value === value) || null

	const onHandleChange = (selected: any) => {
		if (multi === "yes") {
			field.onChange(selected)
		} else {
			field.onChange(selected?.value || "")
		}

		onChange?.(selected as Option)
	}

	return (
		<Select
			{...field}
			instanceId={field.name}
			isMulti={isMulti}
			value={selectedValue}
			onChange={onHandleChange}
			menuPortalTarget={typeof window !== "undefined" ? document.body : null}
			menuPosition="fixed"
			components={animatedComponent}
			placeholder={placeholder}
			options={options}
			defaultValue={defaultValue}
			noOptionsMessage={() => (
				<p className="text-muted-foreground text-sm">No options found</p>
			)}
			formatOptionLabel={(option: Option) => (
				<div className="flex items-center">
					{option.icon && <div className="mr-2">{option.icon}</div>}
					<span>{option.label}</span>
				</div>
			)}
			styles={{
				control: (base) => ({
					...base,
					minHeight: height,
					fontSize,
					backgroundColor: "transparent",
					color: textColor,
					border: borderStyle,
					borderRadius: borderRadius,
					boxShadow: "none"
				}),
				menu: (base) => ({
					...base,
					zIndex: 9999,
					backgroundColor: menuBg || "#fff",
					width: menuWidth || "auto"
				}),
				placeholder: (base) => ({
					...base,
					fontSize,
					color: textColor || "var(--input-placeholder)"
				}),
				menuPortal: (base) => ({
					...base,
					zIndex: 9999,
					pointerEvents: "auto"
				})
			}}
			className={cn("w-full text-sm")}
			classNamePrefix="custom-select"
		/>
	)
}

export default CustomSelect
