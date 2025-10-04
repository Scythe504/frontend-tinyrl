"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog"
import { UpdateURLForm } from "./update-url-form"
import { Button } from "../ui/button"

type UpdateUrlDialogProps = {
  shortCode?: string
  children?: React.ReactNode // Optional custom trigger, e.g. a DropdownMenuItem
  onUpdated?: () => void // Optional callback after successful update
  open?: boolean // controlled open prop
  onOpenChange?: (open: boolean) => void // controlled change handler
}

export function UpdateUrlDialog({ shortCode, onUpdated, open, onOpenChange }: UpdateUrlDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof open === "boolean"
  const openState = isControlled ? (open as boolean) : internalOpen
  const setOpenState = (next: boolean) => {
    if (isControlled) {
      onOpenChange?.(next)
    } else {
      setInternalOpen(next)
    }
  }

  return (
    <Dialog open={openState} onOpenChange={setOpenState}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-balance">Update Short Link</DialogTitle>
          <DialogDescription>Change the destination URL for your existing short code.</DialogDescription>
        </DialogHeader>
        <UpdateURLForm
          initialCode={shortCode}
          onSuccess={() => {
            setOpenState(false)
            onUpdated?.()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
