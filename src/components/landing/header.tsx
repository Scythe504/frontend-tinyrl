"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { ModeToggle } from "../ui/mode-toggle"

export const Header = () => {
  return <header className="w-full max-h-[100px] sticky top-0 left-0 dark:bg-zinc-950/70 bg-white/70 backdrop-blur-xl z-20">
    <div className="h-full dark:bg-zinc-900 bg-white z-10"></div>
    <div className="flex flex-row border-b justify-between items-center sm:px-12 py-4 px-4">
      <Link href={"/"}>
        <h1 className="sm:text-4xl text-3xl font-bold"

        >
          Tiny.RL
        </h1>
      </Link>
      <div className="space-x-2">
        <ModeToggle />
        <Button className="w-auto" variant={"outline"}>
          <Link href="/dashboard" className="sm:text-lg text-sm">
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  </header>
}