import { z } from 'zod'
import { ValidURL } from './utils'

export const shortenUrlSchema = z.object({
  url: z.string().refine(ValidURL, {
    error: "Invalid URL, we only support http/https and urls with proper hostnames."
  })
})

export const updateUrlSchema = z.object({
  code: z
    .string()
    .min(1, "Short code is required")
    .regex(/^[A-Za-z0-9\-_]+$/, "Use only letters, numbers, dashes or underscores"),
  url: z.string().refine(ValidURL, {
    error: "Invalid URL, we only support http/https and urls with proper hostnames."
  }),
})