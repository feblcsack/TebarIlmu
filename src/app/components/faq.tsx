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
      {/* Main Content */}
      <main className="flex-1">
        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
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

            {/* Contact CTA */}
            <div className="mt-12 text-center p-8 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
              <p className="text-gray-600 mb-4">
                {"Can't find the answer you're looking for? Our support team is here to help."}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Company Name</h3>
              <p className="text-gray-400 mb-4 max-w-md">
                Providing quality products and exceptional customer service since 2020. Your satisfaction is our top
                priority.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Company Name. All rights reserved.</p>
            <div className="mt-4 sm:mt-0 flex space-x-6">
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
