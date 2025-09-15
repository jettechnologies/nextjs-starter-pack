import { useState, useEffect } from "react"
import { useMediaQuery as originalUseMediaQuery } from "react-responsive"
import type { MediaQueryType, MediaQueryAllQueryable } from "react-responsive"

type MediaQuerySettings = Partial<MediaQueryAllQueryable & { query?: string }>
interface MediaQueryMatchers {
	aspectRatio?: string
	deviceAspectRatio?: string
	height?: number | string
	deviceHeight?: number | string
	width?: number | string
	deviceWidth?: number | string
	color?: boolean
	colorIndex?: boolean
	monochrome?: boolean
	resolution?: number | string
	orientation?: "portrait" | "landscape"
	scan?: "progressive" | "interlace"
	type?: MediaQueryType
}

interface useSafeMediaQueryProps {
	settings: MediaQuerySettings
	device?: MediaQueryMatchers
	onChange?: (_: boolean) => void
}

export const useSafeMediaQuery = ({
	settings,
	device,
	onChange
}: useSafeMediaQueryProps) => {
	const [enabled, setEnabled] = useState(false)

	useEffect(() => {
		setEnabled(true)
	}, [])

	const matches = originalUseMediaQuery(settings, device, onChange)

	return enabled ? matches : false
}
