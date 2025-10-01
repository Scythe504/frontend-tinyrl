"use client"

import Link from "next/link"
import { Button } from "../ui/button"

export const Header = () => {
  return <header className="min-h-16 sm:px-12 px-4 py-4 flex flex-row w-screen border-b justify-between items-center">
    <h1 className="sm:text-4xl text-3xl font-bold">
      Tiny.RL
    </h1>
    <Button className="sm:w-32">
      <Link href="#shorten" scroll={true} className="sm:text-lg text-sm">
        Get Started
      </Link>
    </Button>
  </header>
}