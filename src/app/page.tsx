import { HeroSection } from "../app/components/hero-section"
import { AnimatedTestimonialsDemo } from "./components/About"
import ChatBot from "./components/ChatBot"
import FAQPage from "./components/faq"
import LandingPage from "./components/LandingPage"


export default function HomePage() {
  return (
    <div>
        <LandingPage/>
      <main className="min-h-screen flex items-center justify-center bg-white">
        <section id="hero"><HeroSection /></section>
       
       </main>
       <ChatBot/>
       <section id="about">
       <AnimatedTestimonialsDemo/>
       </section>
       <FAQPage/>
    </div>
  )
}
