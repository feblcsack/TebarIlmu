import { HeroSection } from "../app/components/hero-section"
import { AILearningAssistant } from "./components/ai/Assistant"
import LandingPage from "./components/LandingPage"

export default function HomePage() {
  return (
    <div>
      
        <LandingPage/>
      <main className="min-h-screen flex items-center justify-center bg-zinc-950">
        <section id="hero"><HeroSection /></section>
        <AILearningAssistant
  sessionTopic="Matematika Dasar"
  userLevel="beginner"
/>
       </main>
    
    </div>
  )
}
