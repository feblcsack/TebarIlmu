import { HeroSection } from "../app/components/hero-section"
import { AILearningAssistant } from "./components/ai/Assistant"
import ChatBot from "./components/ChatBot"
import FAQPage from "./components/faq"
import LandingPage from "./components/LandingPage"
import EducationLanding from "./components/Part"

export default function HomePage() {
  return (
    <div>
      
        <LandingPage/>
      <main className="min-h-screen flex items-center justify-center bg-zinc-950">
        <section id="hero"><HeroSection /></section>
       
       </main>
       <ChatBot/>
       <EducationLanding/>
       <FAQPage/>
    </div>
  )
}
