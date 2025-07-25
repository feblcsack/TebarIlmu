import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import Link from "next/link"

const faqData = [
    {
        id: "item-1",
        question: "What is this learning platform?",
        answer:
          "This is a free online learning platform that uses Jitsi for live video learning. Anyone can join or host a learning session anytime and anywhere, as long as they have an internet connection.",
      },
      {
        id: "item-2",
        question: "Do I need to pay to use this app?",
        answer:
          "No, it's completely free. You can use the platform without any charges to join or create study rooms.",
      },
      {
        id: "item-3",
        question: "Do I need to create an account?",
        answer:
          "No account is required. You can join learning sessions directly using a room link or create your own learning room instantly.",
      },
      {
        id: "item-4",
        question: "Is it safe and private?",
        answer:
          "Yes. The platform is built on Jitsi, which is an open-source and secure video conferencing tool. You can also set a password for your room to limit access.",
      },
      {
        id: "item-5",
        question: "Can I access this from my phone?",
        answer:
          "Absolutely! The platform is accessible via any device — desktop, tablet, or mobile — through a web browser. No need to install anything.",
      },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-to-t from-[#a6f898] to-white">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about Tebar Ilmu.
              </p>
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-gray-200 rounded-lg px-6 py-2 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-gray-700 py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4 leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#232323] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <Image src="/logo/transparent.png" alt="Logo" width={100} height={100} className="mb-4" />
              <p className="text-gray-400 mb-4 max-w-md">
              Knowledge is a Right, Not a Privilege..
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>


            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Credits</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Freepik
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Gemini
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                    Next.js
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                    Firebase
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Team CAW. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
