import {
	MAX_DOCUMENT_SIZE,
	MAX_IMAGE_SIZE,
	SUPPORTED_IMAGE_TYPES,
	SUPPORTED_DOCUMENT_TYPES
} from "@/utils/constants"
import { z } from "zod"

// Image Schema
export const ImageFileSchema = z
	.custom<File>(
		(file) => file instanceof File || file === undefined || file === null,
		{
			message: "Expected a file"
		}
	)
	.refine(
		(file) => {
			if (!file) return true // allow empty, handle "required" separately
			return SUPPORTED_IMAGE_TYPES.includes(file.type)
		},
		{
			message:
				"Unsupported file format. Supported formats are .jpeg, .png, .gif, .webp, .svg, .jpg"
		}
	)
	.refine(
		(file) => {
			if (!file) return true
			return file.size <= MAX_IMAGE_SIZE
		},
		{
			message: "File size must be less than 20mb"
		}
	)

// Document Schema
export const DocumentFileSchema = z
	.custom<File>(
		(file) => file instanceof File || file === undefined || file === null,
		{
			message: "Expected a file"
		}
	)
	.refine(
		(file) => {
			if (!file) return true
			return SUPPORTED_DOCUMENT_TYPES.includes(file.type)
		},
		{
			message:
				"Unsupported file format. Supported formats are .pdf, .doc, .docx"
		}
	)
	.refine(
		(file) => {
			if (!file) return true
			return file.size <= MAX_DOCUMENT_SIZE
		},
		{
			message: "File size must be less than 20mb"
		}
	)
