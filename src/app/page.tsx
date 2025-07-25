import { HeroSection } from "../app/components/hero-section"
import { AnimatedTestimonialsDemo } from "./components/About"
import { AILearningAssistant } from "./components/ai/Assistant"
import ChatBot from "./components/ChatBot"
import FAQPage from "./components/faq"
import Component from "./components/Introduce"
import LandingPage from "./components/LandingPage"
import EducationLanding from "./components/Part"

export default function HomePage() {
  return (
    <div>
        <LandingPage/>
      <main className="min-h-screen flex items-center justify-center bg-white">
        <section id="hero"><HeroSection /></section>
       
       </main>
       <ChatBot/>
       <EducationLanding/>
       <Component/>
       <section id="about">
       <AnimatedTestimonialsDemo/>
       </section>
       <FAQPage/>
    </div>
  )
}
