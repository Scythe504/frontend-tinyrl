'use client'
import { shortenUrlSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

export const ShortenForm = () => {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  const [shortLink, setShortLink] = useState("")
  const [generatingUrl, setGeneratingUrl] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [errorMsg, setErrorMessage] = useState("")

  const form = useForm<z.infer<typeof shortenUrlSchema>>({
    resolver: zodResolver(shortenUrlSchema),
    defaultValues: {
      url: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof shortenUrlSchema>) => {
    setGeneratingUrl(true)
    const reqBody = {
      "url": values.url
    }
    try {
      const res = await fetch(backendURL, {
        body: JSON.stringify(reqBody)
      })

      if (res.status !== 200) {
        throw new Error(`Failed to get url: ${res.statusText}`)
      }

      const { data }: {
        data: string;
      } = await res.json()

      setShortLink(data)
      setGeneratingUrl(false)
      setSuccess(true)

    } catch (error) {
      setErrorMessage('Failed to generate url, please try again later')
      console.error(`[ShortenForm] error: `, error)
    }
  }

  return (
    <div>
      
    </div>
  )
}