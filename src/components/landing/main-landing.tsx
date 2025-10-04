import { ShortenURLForm } from "../form/shorten-form"
import { ScrollArea } from "../ui/scroll-area"
import { Header } from "./header"
import { HeroSection } from "./hero-section"

export const LandingPage = () => {
  return (
    <div className="w-full flex flex-col items-center pb-10 md:px-40 px-4">
      <HeroSection />
      <ShortenURLForm />
    </div>
  )
}