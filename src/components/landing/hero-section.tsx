import Link from "next/link"
import { Button } from "../ui/button"

export const HeroSection = () => {
  return <section className="flex flex-col items-center md:gap-12 gap-6 justify-center sm:min-h-[650px] min-h-[500px]">
    <div className="flex flex-col items-center gap-4">
      {/* Heading */}
      <h1 className="md:text-5xl text-3xl font-bold">
        Your Links, Your Data
      </h1>
      {/* Sub-heading */}
      <h2 className="font-semibold lg:text-3xl md:text-xl text-sm text-muted-foreground text-center">
        TinyRL lets you shorten, monitor, and optimize your URLs with real-time analytics and custom reporting.
      </h2>
    </div>
    <Link href={"#shorten"}>
      <Button size={"lg"} className="md:w-40 sm:text-lg">
        Start Now
      </Button>
    </Link>
  </section>
}