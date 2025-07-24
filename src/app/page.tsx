import { HeroSection } from "../app/components/hero-section"
import EducationSection from "./components/EducationSection"
import Navbar from "./components/Navbar"
import { MarqueeDemo } from "./components/Testimonial"

export default function HomePage() {
  return (
    <div className=" bg-white">
        {/* <Navbar/> */}
      <main className="min-h-screen flex items-center justify-center bg-black">
      
      <HeroSection />
    </main>
    <MarqueeDemo/>
    {/* <EducationSection/> */}
    </div>
  )
}
