import { Link } from "lucide-react"
import { ShortenURLForm } from "../form/shorten-form"
import { Separator } from "../ui/separator"
import { AnalyticsPreview } from "./analytics-preview"
import { HeroSection } from "./hero-section"

export const LandingPage = () => {
  return (
    <div className="w-full flex flex-col items-center pb-10 md:px-40 px-4 gap-2">
      <HeroSection />
      <Separator orientation="horizontal" />
      <section className="w-full py-10" 
        id="shorten"
      >
        <div className="w-full flex flex-col items-center gap-y-4 pb-10">
          <p className="flex flex-row items-center justify-center sm:text-base text-sm text-muted-foreground">
            <Link />Quick Shorten
          </p>
          <h1 className="text-3xl font-bold">Smarter Link Shortening</h1>
          <p className="text-xl text-muted-foreground">Transform long URLs into quick, branded short links, built for creators, teams, and businesses.</p>
        </div>
        <ShortenURLForm />
      </section>
      <Separator orientation="horizontal" />
      <AnalyticsPreview />
    </div>
  )
}