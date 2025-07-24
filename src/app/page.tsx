import { HeroSection } from "../app/components/hero-section"
import LandingPage from "./components/LandingPage"
import { Navbar } from "./components/Navbar"

export default function HomePage() {
  return (
    <div className=" bg-white">
      <Navbar/>
        <LandingPage/>
      <main className="min-h-screen flex items-center justify-center bg-zinc-950">
      <HeroSection />
    </main>
    </div>
  )
}
