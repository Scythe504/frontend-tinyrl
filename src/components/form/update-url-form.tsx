"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"
import { updateUrlSchema } from "@/lib/zod"

export function UpdateURLForm({
  initialCode,
}: {
  initialCode?: string
}) {
  const [updating, setUpdating] = useState(false)
  const [errorMsg, setErrorMessage] = useState("")
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

  const form = useForm<z.infer<typeof updateUrlSchema>>({
    resolver: zodResolver(updateUrlSchema),
    defaultValues: {
      code: initialCode || "",
      url: "",
    },
  })

  useEffect(() => {
    if (initialCode) {
      form.reset({ code: initialCode, url: "" })
    }
  }, [initialCode, form])

  const onSubmit = async (values: z.infer<typeof updateUrlSchema>) => {
    setUpdating(true)
    setErrorMessage("")

    try {
      const res = await fetch(`${backendURL}/api/update-link`, {
        method: "PATCH",
        body: JSON.stringify({
          "short_code": values.code,
          "url": values.url
        }),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        const message = error.message || `Failed to update: ${res.status}`
        throw new Error(message)
      }
      await res.json()

      toast("Short link updated", {
        description: "The destination URL has been updated.",
      })
    } catch (error) {
      setErrorMessage("Failed to update URL, please try again later.")
      toast("Failed to update URL", {
        description: "Please try again later.",
      })
      console.error("[UpdateURLForm] error:", error)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Card className="w-full border-0 bg-background">
      <CardContent className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="gap-4 flex flex-col">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Code</FormLabel>
                    <FormControl>
                      {updating ? <Skeleton className="h-10 w-full" /> : <Input readOnly {...field} />}
                    </FormControl>
                    <FormDescription>The identifier of the short link you want to update.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Destination URL</FormLabel>
                    <FormControl>
                      {updating ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Input placeholder="https://example.com/new-destination" {...field} />
                      )}
                    </FormControl>
                    <FormDescription>Enter the full URL including http:// or https://</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="lg:hidden" />

            <Button type="submit" className="w-full lg:w-auto" disabled={updating} aria-busy={updating}>
              {updating ? "Updating..." : "Update"}
            </Button>

            {errorMsg ? (
              <p className="text-sm text-destructive" role="alert" aria-live="polite">
                {errorMsg}
              </p>
            ) : null}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

