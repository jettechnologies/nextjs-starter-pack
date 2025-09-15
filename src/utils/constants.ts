export const SUPPORTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/svg+xml",
	"image/jpg"
]

export const SUPPORTED_DOCUMENT_TYPES = [
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]

export const MAX_IMAGE_SIZE = 20 * 1024 * 1024
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024
export const TOKEN_KEY = `${process.env.NEXT_PUBLIC_DLC_LIVE_URL}`
