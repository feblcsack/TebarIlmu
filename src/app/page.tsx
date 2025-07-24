import { HeroSection } from "../app/components/hero-section"
import LandingPage from "./components/LandingPage"

export default function HomePage() {
  return (
    <div className=" bg-white">
        <LandingPage/>
      <main className="min-h-screen flex items-center justify-center bg-zinc-950">
      <HeroSection />
    </main>
    </div>
  )
}
