"use client"

import { LocalStorageService } from "@/lib/lc-storage"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UpdateUrlDialog } from "@/components/form/update-url-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { toast } from "sonner"


const EditButton = ({
  shortUrl,
  frontendUrl,
  editUrlDest,
}: {
  shortUrl: string
  frontendUrl: string
  editUrlDest: () => void
}) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = async (shortURL: string) => {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon"} aria-label="Edit">
          <span className="sr-only">Edit</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleCopy(`${frontendUrl}/${shortUrl}`)}>
          Copy TinyURL
        </DropdownMenuItem>
        <DropdownMenuItem onClick={editUrlDest}>Edit Destination Url</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const LinkTable = () => {
  const [shortUrls, setShortUrls] = useState<ShortUrl[] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedShortCode, setSelectedShortCode] = useState<string | null>(null)
  const router = useRouter()

  const frontendUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

  useEffect(() => {
    const storage = LocalStorageService.getInstance()
    setShortUrls(storage.get())
  }, [])



  const updateUrl = (shortCode: string) => {
    setSelectedShortCode(shortCode)
    setDialogOpen(true)
  }

  return (
    <>
      <UpdateUrlDialog
        shortCode={selectedShortCode ?? ""}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdated={() => {
          // Refresh local storage after a successful update if needed
          const storage = LocalStorageService.getInstance()
          setShortUrls(storage.get())
          setDialogOpen(false)
        }}
      />
      <Table>
        <TableCaption>A list of your TinyURLs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Short Code</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Analytics</TableHead>
            <TableHead>
              <span className="sr-only">
                Edit
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shortUrls?.map((s) => (
            <TableRow key={s.shortUrl} className="">
              <TableCell>{s.shortUrl}</TableCell>
              <TableCell>{s.destUrl}</TableCell>
              <TableCell>{s.created_at}</TableCell>
              <TableCell>{s.updated_at}</TableCell>
              <TableCell>
                <Button
                  className="text-left p-0"
                  variant={"link"}
                  onClick={() => router.push(`/dashboard/${s.shortUrl}`)}>
                  Check Here
                </Button>
              </TableCell>
              <TableCell>
                <EditButton
                  shortUrl={s.shortUrl}
                  frontendUrl={frontendUrl}
                  editUrlDest={() => updateUrl(s.shortUrl)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
