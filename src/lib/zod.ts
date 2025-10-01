import { z } from 'zod'
import { ValidURL } from './utils'

export const shortenUrlSchema = z.object({
  url: z.string().refine(ValidURL, {
    error: "Invalid URL, we only support http/https and urls with proper hostnames."
  })
})