import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

interface InputOTPPatternProps {
	maxLength?: number
	pattern?: string
	className?: string
	disabled?: boolean
	slotClassName?: string
}

export type InputOTPProps = InputOTPPatternProps &
	Omit<React.ComponentProps<typeof InputOTP>, "children" | "render">

export const InputOTPPattern = ({
	maxLength = 6,
	pattern = REGEXP_ONLY_DIGITS_AND_CHARS,
	className,
	disabled,
	slotClassName,
	...otherProps
}: InputOTPProps) => {
	return (
		<InputOTP
			{...otherProps}
			disabled={disabled}
			maxLength={maxLength}
			pattern={pattern}
			containerClassName={className}
		>
			<InputOTPGroup>
				{Array.from({ length: maxLength }).map((_, idx) => (
					<InputOTPSlot key={idx} index={idx} className={slotClassName} />
				))}
			</InputOTPGroup>
		</InputOTP>
	)
}

// export const InputOTPPattern = ({
// 	maxLength = 6,
// 	pattern = REGEXP_ONLY_DIGITS_AND_CHARS,
// 	className,
// 	disabled,
// 	slotClassName
// }: InputOTPPatternProps) => {
// 	return (
// 		<InputOTP
// 			disabled={disabled}
// 			maxLength={maxLength}
// 			pattern={pattern}
// 			className={className}
// 		>
// 			<InputOTPGroup>
// 				{Array.from({ length: maxLength }).map((_, idx) => (
// 					<InputOTPSlot key={idx} index={idx} className={slotClassName} />
// 				))}
// 			</InputOTPGroup>
// 		</InputOTP>
// 	)
// }

// import {
// 	InputOTP,
// 	InputOTPGroup,
// 	InputOTPSlot
// } from "@/components/ui/input-otp"
// import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

// export interface InputOTPPatternProps {
// 	maxLength?: number
// 	pattern?: string
// 	className?: string
// 	disabled?: boolean
// 	slotClassName?: string
// }

// export const InputOTPPattern = ({
// 	maxLength = 6,
// 	pattern = REGEXP_ONLY_DIGITS_AND_CHARS,
// 	className,
// 	disabled,
// 	slotClassName,
// 	...otherProps
// }: InputOTPPatternProps &
// 	Omit<React.ComponentProps<typeof InputOTP>, "children">) => {
// 	return (
// 		<InputOTP
// 			{...otherProps}
// 			disabled={disabled}
// 			maxLength={maxLength}
// 			pattern={pattern}
// 			className={className}
// 			render={() => (
// 				<InputOTPGroup>
// 					{Array.from({ length: maxLength }).map((_, idx) => (
// 						<InputOTPSlot key={idx} index={idx} className={slotClassName} />
// 					))}
// 				</InputOTPGroup>
// 			)}
// 		/>
// 	)
// }

// export const InputOTPPattern = ({
// 	maxLength = 6,
// 	pattern = REGEXP_ONLY_DIGITS_AND_CHARS,
// 	className,
// 	disabled,
// 	slotClassName,
// 	...otherProps // Accept other props
// }: InputOTPPatternProps &
// 	Omit<React.ComponentProps<typeof InputOTP>, "children">) => {
// 	return (
// 		<InputOTP
// 			{...otherProps} // Forward all other props including registration
// 			disabled={disabled}
// 			maxLength={maxLength}
// 			pattern={pattern}
// 			className={className}
// 		>
// 			<InputOTPGroup>
// 				{Array.from({ length: maxLength }).map((_, idx) => (
// 					<InputOTPSlot key={idx} index={idx} className={slotClassName} />
// 				))}
// 			</InputOTPGroup>
// 		</InputOTP>
// 	)
// }
