'use client'
import { shortenUrlSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { ShortenedLink } from "./shortened-url"
import { toast } from "sonner"
import { Skeleton } from "../ui/skeleton"
import { LocalStorageService } from "@/lib/lc-storage"

export const ShortenURLForm = () => {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  const [shortLink, setShortLink] = useState("")
  const [generatingUrl, setGeneratingUrl] = useState(false)
  const [errorMsg, setErrorMessage] = useState("")

  const form = useForm<z.infer<typeof shortenUrlSchema>>({
    resolver: zodResolver(shortenUrlSchema),
    defaultValues: {
      url: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof shortenUrlSchema>) => {
    setGeneratingUrl(true)
    setErrorMessage("")
    const reqBody = {
      url: values.url,
    }
    try {
      const res = await fetch(`${backendURL}/api/shorten`, {
        method: "POST",
        body: JSON.stringify(reqBody),
      })

      if (res.status !== 200) {
        throw new Error(`Failed to get url: ${res}`)
      }

      const { data }: { data: string } = await res.json()

      setShortLink(data)

      const storage = LocalStorageService.getInstance()
      const sliceLen = data.length
      const shortCode = data.slice(sliceLen-6, sliceLen)
      storage.push(shortCode, values.url)

      toast("Short link created", {
        description: "Your TinyRL is ready to copy and share.",
      })
    } catch (error) {
      setErrorMessage("Failed to generate url, please try again later")
      toast("Failed to generate URL", {
        description: "Please try again later.",
      })
      console.error(`[ShortenForm] error: `, error)
    } finally {
      setGeneratingUrl(false)
    }
  }


  return (
    <Card className="flex lg:flex-row flex-col w-full lg:space-x-2 space-y-2">
      <Card id="shorten" className="border-0 w-full">
        <CardHeader>
          <CardTitle>Shorten Your Link</CardTitle>
          <CardDescription>Paste a long URL below and instantly get a short, shareable link.</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long URL</FormLabel>
                    <FormControl>
                      {generatingUrl ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Input placeholder="https://example.com/your-long-link" {...field} />
                      )}
                    </FormControl>
                    <FormDescription>
                      Enter the full URL you want to shorten. Make sure it includes http:// or https://
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant={"default"}
                className="w-full"
                disabled={generatingUrl}
                aria-busy={generatingUrl}
              >
                {generatingUrl ? "Shortening..." : "Shorten"}
              </Button>
              {errorMsg ? <p className="text-sm text-destructive">{errorMsg}</p> : null}
            </form>
          </Form>
        </CardContent>
      </Card>
      <div>
        {/* Large Screens */}
        <Separator orientation="vertical" className="lg:block hidden" />
        {/* Small Screens */}
        <Separator orientation="horizontal" className="lg:hidden block" />
      </div>
      <ShortenedLink shortURL={shortLink} loading={generatingUrl} />
    </Card>
  )
}