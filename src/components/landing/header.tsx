"use client"

import Link from "next/link"
import { Button } from "../ui/button"

export const Header = () => {
  return <header className="w-full sticky top-0 left-0 dark:bg-zinc-950/50 bg-current/50 backdrop-blur-2xl">
    <div className="flex flex-row border-b justify-between items-center sm:px-12 py-4 px-4">
      <h1 className="sm:text-4xl text-3xl font-bold">
        Tiny.RL
      </h1>
      <Button className="sm:w-32">
        <Link href="#shorten" className="sm:text-lg text-sm">
          Get Started
        </Link>
      </Button>
    </div>
  </header>
}