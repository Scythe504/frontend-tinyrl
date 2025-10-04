'use client'
import { Redirect } from "@/components/redirect/main-redirect";
import { usePathname } from "next/navigation";

export default function RedirectPage() {
  const pathname = usePathname()
  const shCode = pathname.split('/')[1]

  return <div className="flex flex-col h-full sm:px-40 py-16 px-4 w-full items-center justify-center">
    <Redirect shortCode={shCode}/>
  </div>
}