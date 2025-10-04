"use client"

import { Copy, CopyCheck, Share2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { useState } from "react"
import { Separator } from "../ui/separator"
import { Label } from "../ui/label"
import { Skeleton } from "../ui/skeleton"
import { toast } from "sonner"

type Props = {
  shortURL: string
  loading?: boolean
}

export const ShortenedLink = ({ shortURL, loading = false }: Props) => {
  const [copied, setCopied] = useState(false)

  const shareData: ShareData = {
    title: "Check this out!",
    text: `Here's a short link I made with TinyRL:`,
    url: shortURL,
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortURL)
      setCopied(true)
      toast("Copied!", { description: "Short URL copied to clipboard." })
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast("Copy failed", {
        description: "Please try copying manually.",
      })
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast("Shared!", { description: "Your link was shared successfully." })
      } else {
        await navigator.clipboard.writeText(shortURL)
        toast("Share not supported", {
          description: "Link copied to clipboard instead.",
        })
      }
    } catch {
      toast("Share failed", {
        description: "Please try again or copy the link.",
      })
    }
  }

  return (
    <Card className="w-full border-0 h-full">
      <CardHeader>
        <CardTitle>Your Short Link is Ready!</CardTitle>
        <CardDescription>Copy and share your TinyRL anywhere.</CardDescription>
      </CardHeader>
      <CardContent className="space-x-2 flex flex-col w-full">
        <Label>Short URL</Label>
        <div className="flex flex-row items-center space-x-1 pt-2">
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input value={shortURL} readOnly className="ring-0 hover:ring-0 focus:ring-0 focus-visible:ring-0" />
          )}
          <Separator orientation="vertical" className="mx-2 h-full" />
          <Button
            variant={"secondary"}
            onClick={handleCopy}
            disabled={loading || !shortURL}
            aria-disabled={loading || !shortURL}
            aria-label="Copy short URL"
          >
            {copied ? <CopyCheck /> : <Copy />}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm pt-2">
          Your link is live and ready. Share the link directly from here.
        </p>
      </CardContent>
      <CardFooter className="pt-7">
        <Button
          className="w-full"
          onClick={handleShare}
          disabled={loading || !shortURL}
          aria-disabled={loading || !shortURL}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Link
        </Button>
      </CardFooter>
    </Card>
  )
}
