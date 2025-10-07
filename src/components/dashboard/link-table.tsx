"use client"

import { LocalStorageService } from "@/lib/lc-storage"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowDownNarrowWide, ArrowUpDown, ArrowUpNarrowWide, ListFilter, MoreHorizontal, MoreVertical, Plus, PlusCircle, Search, SortDesc } from "lucide-react"

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
import { toast } from "sonner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import Link from "next/link"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "../ui/dialog"
import { ShortenURLForm } from "../form/shorten-form"
import { UpdateURLForm } from "../form/update-url-form"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"


const EditButton = ({
  shortUrl,
  frontendUrl,
}: {
  shortUrl: string
  frontendUrl: string
}) => {
  const [copied, setCopied] = useState(false)
  const [success, setSuccess] = useState(false)
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
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit Destination Url
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="border-0 shadow-transparent min-w-[50%] min-h-[60%] p-1 flex items-center">
            <DialogTitle className="sr-only">Update Url Destination</DialogTitle>
            <UpdateURLForm
              initialCode={shortUrl}
            />
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const LinkTable = () => {
  const [shortUrls, setShortUrls] = useState<ShortUrl[] | null>(null)
  const router = useRouter()

  const [sortBy, setsortBy] = useState<"click" | "created">("click")

  const frontendUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

  useEffect(() => {
    const storage = LocalStorageService.getInstance()
    setShortUrls(storage.get())
  }, [sortBy])

  const sortOptions = useMemo(
    () => [
      {
        label: "Clicks",
        sortBy: "click"
      },
      {
        label: "Date created",
        sortBy: "created"
      }
    ], [],
  )

  return (
    <>
      <div className="border-b mb-2 flex justify-between items-center min-h-12">
        <h1 className="font-bold font-mono text-2xl">
          Links
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Create Link
            </Button>
          </DialogTrigger>
          <DialogTitle className="sr-only">
            Create Link Form
          </DialogTitle>
          <DialogContent className="bg-transparent border-0 shadow-transparent min-w-[75%] p-1">
            <ShortenURLForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex p-2 justify-between">
        <Select value={sortBy}
          onValueChange={(v: "click" | "created") => setsortBy(v)}
        >
          <SelectTrigger>
            <ArrowUpDown /> Sort
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort</SelectLabel>
                {sortOptions.map((opt) => (
                  <SelectItem
                    key={opt.sortBy}
                    value={opt.sortBy}
                  >
                    <SortDesc />{opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectTrigger>
        </Select>
        <div className="flex flex-row gap-2 items-center">
          <div className="relative h-10 w-auto md:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-3 text-muted-foreground z-10" size={20} />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-3 py-2 text-md w-full"
            />
          </div>
          {/* Future Stuff */}
          {/* <Separator orientation="vertical" />
          <Button className="aspect-square" size={"icon"}>
            <MoreVertical/>
          </Button> */}
        </div>
      </div>
      <Table>
        <TableCaption>A list of your TinyURLs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Short Code</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Analytics</TableHead>
            <TableHead>
              <span className="sr-only">
                Edit
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="max-h-[450px]">
          {shortUrls?.map((s) => (
            <TableRow key={s.shortUrl} className="">
              <TableCell>{s.shortUrl}</TableCell>
              <TableCell className="max-w-[40px] truncate">{s.destUrl}</TableCell>
              <TableCell>{s.created_at}</TableCell>
              <TableCell>
                <Button
                  variant={"link"}
                  className="text-left p-0 underline"
                  onClick={() => router.push(`/dashboard/${s.shortUrl}`)}
                >
                  <p>
                    Check Here
                  </p>
                </Button>
              </TableCell>
              <TableCell>
                <EditButton
                  shortUrl={s.shortUrl}
                  frontendUrl={frontendUrl}
                // editUrlDest={() => updateUrl(s.shortUrl)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
