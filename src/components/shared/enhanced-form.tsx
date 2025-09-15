/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { InputOTPPattern, type InputOTPProps } from "./form"
import { Button, buttonVariants } from "@/components/ui/button"
import {
	FormControl,
	FormDescription,
	FormField as ShadcnFormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { VariantProps } from "class-variance-authority"
import { Eye, EyeOff } from "lucide-react"
import React, { useState, ReactNode } from "react"
import {
	useForm,
	FormProvider,
	UseFormReset,
	useFormContext,
	Controller,
	type FieldValues,
	type Path,
	type Control,
	type UseFormReturn,
	type DefaultValues,
	type UseFormProps,
	type ControllerRenderProps
} from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { z, ZodTypeAny, ZodRawShape } from "zod"

/* eslint-disable @typescript-eslint/no-explicit-any */

// Types
type InputSize = "sm" | "md" | "lg"
type RadiusSize = string | number
type InputType =
	| "text"
	| "email"
	| "password"
	| "number"
	| "tel"
	| "url"
	| "search"
	| "textarea"

// Better schema constraint that ensures compatibility with zodResolver
type ValidZodSchema =
	| z.ZodType<FieldValues, any, any>
	| z.ZodObject<ZodRawShape>

export type FormFieldProps<T extends FieldValues> = {
	control?: Control<T>
	name: Path<T>
	label?: string
	labelClassName?: string
	description?: string
	placeholder?: string
	formItemClassName?: string
	inputSize?: InputSize
	radius?: RadiusSize
	className?: string
	style?: React.CSSProperties
	disabled?: boolean
	required?: boolean
	type?: InputType
}

interface OtpFieldProps<T extends FieldValues> extends InputOTPProps {
	name: Path<T>
	control?: Control<T>
}

export type FormField<T extends FieldValues> = FormFieldProps<T> & {
	zodType?: ZodTypeAny
	render?: (field: ControllerRenderProps<T, Path<T>>) => ReactNode
	children?: ReactNode
}

interface SubmitButtonProps extends VariantProps<typeof buttonVariants> {
	className?: string
	children?: ReactNode
	isDisabled?: boolean
	loading?: boolean
	loadingText?: string
	content?: string
}

type FormProps<T extends ValidZodSchema> = {
	schema: T
	fields?: FormField<z.infer<T>>[]
	onSubmit: (
		data: z.infer<T>,
		options?: { resetForm: UseFormReset<z.infer<T>> }
	) => void
	children?: ReactNode | ((methods: UseFormReturn<z.infer<T>>) => ReactNode)
	defaultValues?: DefaultValues<z.infer<T>>
	className?: string
	style?: React.CSSProperties
}

type UseFormHookProps<T extends ValidZodSchema> = {
	schema: T
	defaultValues?: DefaultValues<z.infer<T>>
	mode?: UseFormProps<z.infer<T>>["reValidateMode"]
}

// Input Component with Password Toggle
const InputFieldComponent = <T extends FieldValues>({
	name,
	placeholder,
	inputSize = "md",
	radius,
	className,
	style,
	type = "text",
	disabled,
	required,
	...props
}: FormFieldProps<T>) => {
	const { register } = useFormContext<T>()
	const [showPassword, setShowPassword] = useState(false)

	const sizeClasses = {
		sm: "h-8 px-2 text-sm",
		md: "h-10 px-4 text-base",
		lg: "h-12 px-6 text-lg"
	}

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	const inputType =
		type === "password" ? (showPassword ? "text" : "password") : type

	return (
		<div className="relative">
			<input
				{...register(name)}
				type={inputType}
				placeholder={placeholder}
				disabled={disabled}
				required={required}
				className={twMerge(
					`block w-full rounded-lg bg-[#fbfbfb] font-poppins font-normal text-black ${
						sizeClasses[inputSize]
					} ${type === "password" ? "pr-12" : ""}`,
					className
				)}
				style={{ borderRadius: radius, ...style }}
				{...props}
			/>
			{type === "password" && (
				<button
					type="button"
					onClick={togglePasswordVisibility}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
					tabIndex={-1}
				>
					{!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
				</button>
			)}
		</div>
	)
}

const OtpFieldComponent = <T extends FieldValues>({
	name,
	control,
	maxLength,
	className,
	pattern,
	slotClassName,
	disabled,
	...props
}: OtpFieldProps<T>) => {
	const methods = useFormContext<T>()

	return (
		<Controller
			control={control ?? methods.control}
			name={name}
			render={({ field }) => (
				<InputOTPPattern
					{...props}
					value={field.value ?? ""}
					onChange={field.onChange}
					pattern={pattern}
					maxLength={maxLength}
					className={className}
					slotClassName={slotClassName}
					disabled={disabled}
				/>
			)}
		/>
	)
}

// TextArea Component
const TextAreaFieldComponent = <T extends FieldValues>({
	name,
	placeholder,
	className,
	style,
	disabled,
	required,
	...props
}: FormFieldProps<T>) => {
	const { register } = useFormContext<T>()

	return (
		<textarea
			{...register(name)}
			placeholder={placeholder}
			disabled={disabled}
			required={required}
			className={twMerge(
				`block w-full bg-[#fbfbfb] p-2.5 font-poppins text-sm font-normal text-black lg:text-base rounded-lg`,
				className
			)}
			style={style}
			{...props}
		/>
	)
}

export const EnhancedForm = {
	useFormHook: <T extends ValidZodSchema>({
		schema,
		defaultValues,
		mode = "onChange"
	}: UseFormHookProps<T>): UseFormReturn<z.infer<T>> => {
		return useForm<z.infer<T>>({
			resolver: zodResolver(schema as any), // Type assertion needed due to zodResolver's strict typing
			reValidateMode: mode,
			mode,
			defaultValues
		})
	},

	Root: <T extends ValidZodSchema>({
		schema,
		fields,
		onSubmit,
		children,
		defaultValues,
		className,
		style
	}: FormProps<T>) => {
		const methods = EnhancedForm.useFormHook<T>({ schema, defaultValues })

		return (
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit((data) =>
						onSubmit(data, { resetForm: methods.reset })
					)}
					className={className}
					style={style}
				>
					{fields?.map((field) => (
						<EnhancedForm.Field
							key={field.name as string}
							{...field}
							control={methods.control}
						/>
					))}
					{typeof children === "function" ? children(methods) : children}
				</form>
			</FormProvider>
		)
	},

	Field: <T extends FieldValues>({
		control,
		name,
		label,
		labelClassName,
		description,
		className,
		formItemClassName,
		style,
		radius,
		inputSize = "md",
		placeholder,
		disabled,
		required,
		type = "text",
		render,
		children
	}: FormField<T>) => {
		return (
			<ShadcnFormField
				control={control!}
				name={name}
				render={({ field }) => (
					<FormItem className={cn("w-full", formItemClassName)}>
						{label && <FormLabel className={labelClassName}>{label}</FormLabel>}
						<FormControl>
							<div>
								{render ? (
									render(field)
								) : children ? (
									children
								) : type === "textarea" ? (
									<TextAreaFieldComponent
										{...{
											name,
											placeholder,
											className,
											style,
											disabled,
											required
										}}
									/>
								) : (
									<InputFieldComponent
										{...{
											name,
											type,
											placeholder,
											inputSize,
											radius,
											className,
											style,
											disabled,
											required
										}}
									/>
								)}
							</div>
						</FormControl>
						{description && <FormDescription>{description}</FormDescription>}
						<FormMessage />
					</FormItem>
				)}
			/>
		)
	},

	Submit: ({
		children,
		className,
		isDisabled,
		loadingText,
		loading,
		content,
		...props
	}: SubmitButtonProps) => {
		const { formState } = useFormContext()
		return (
			<Button
				className={className}
				disabled={isDisabled ?? !formState.isValid}
				type="submit"
				{...props}
			>
				{formState.isLoading || loading
					? loadingText || "Loading..."
					: content || children}
			</Button>
		)
	},

	// Export individual components for direct use
	Input: InputFieldComponent,
	TextArea: TextAreaFieldComponent,
	OtpInput: OtpFieldComponent
}
