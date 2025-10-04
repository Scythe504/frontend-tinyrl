"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { CircularTimer } from "@/components/ui/timer"
import { PreviewLink } from "./preview-link"

export const Redirect = ({ shortCode }: { shortCode: string }) => {
  const duration = 5
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  const [timerActive, setTimerActive] = useState(false)
  const [redirectData, setRedirectData] = useState<RedirectUrlData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const fn = async () => {
      try {
        const res = await fetch(`${backendURL}/${shortCode}`)
        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`)
        }
        const { data }: { data: RedirectUrlData } = await res.json()
        if (!cancelled) {
          setRedirectData({ short_code: data.short_code, url: data.url })
        }
      } catch (error) {
        toast.error("Redirect failed", {
          description: "We couldn't find a destination for this short link. Please try again or request a new one.",
        })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fn()
    return () => {
      cancelled = true
    }
  }, [backendURL, shortCode])

  useEffect(() => {
    setTimerActive(Boolean(redirectData?.url) && !loading)
  }, [redirectData, loading])

  const onTimerComplete = () => {
    if (!redirectData?.url) {
      toast.error("Can't redirect yet", {
        description: "No valid destination URL was provided.",
      })
      return
    }
    window.location.href = redirectData.url
  }

  return (
    <Card className="h-full sm:min-w-[500px] min-w-full">
      <CardHeader className="text-center space-y-4">
        <CardTitle>{loading ? "Preparing your redirect..." : "You will be redirected in"}</CardTitle>
        <CardContent className="flex flex-col items-center gap-4">
          <CircularTimer
            duration={duration}
            isActive={timerActive}
            onComplete={onTimerComplete}
            className="text-primary"
          />
          <PreviewLink fullUrl={redirectData?.url ?? ""} loading={loading} />
        </CardContent>
      </CardHeader>
    </Card>
  )
}
