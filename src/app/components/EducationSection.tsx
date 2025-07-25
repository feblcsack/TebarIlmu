import Image from "next/image"

export default function EducationSection() {
  return (
    <div className="bg-[#ffffff] min-h-screen p-8 lg:p-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[#505050] text-lg">We believe,</p>
              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[#505050] text-3xl lg:text-4xl font-light">Education is a</span>
                  <span className="text-[#505050] text-3xl lg:text-4xl font-light italic">right —— not a</span>
                </div>
                <div className="relative inline-block">
                <h1 className="bg-gradient-to-r from-[#67ca7e] via-[#8cc941] to-[#297208] text-transparent bg-clip-text text-6xl lg:text-8xl font-bold tracking-tight">
  PRIVILEGE
</h1>
                  <div className="absolute bottom-8 left-0 w-full h-1 opacity-70 bg-[#8c2f2f]"></div>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-lg">
              <p className="text-[#616161] text-base leading-relaxed">
                regardless of their background, economic status, etc deserves equal access to quality learning.
                Knowledge should be <span className="bg-gradient-to-r from-[#67ca7e] via-[#8cc941] to-[#297208] text-transparent bg-clip-text font-medium">inclusive.</span>
              </p>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative">
            <div className="grid grid-cols-1 gap-4">
              <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=320&width=480"
                  alt="Teacher helping students in classroom"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 lg:h-64 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=256&width=384"
                  alt="Student writing and studying"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 lg:mt-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* SDG Logo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-[#8c2f2f] rounded-lg flex flex-col items-center justify-center text-white">
                <div className="text-4xl font-bold">4</div>
                <div className="text-xs font-medium text-center leading-tight">
                  QUALITY
                  <br />
                  EDUCATION
                </div>
                <div className="mt-2">
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-white">
                    <path d="M4 4h24v16H4V4z" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M8 8h16v8H8V8z" stroke="currentColor" strokeWidth="1" fill="none" />
                    <path d="M12 12h8" stroke="currentColor" strokeWidth="1" />
                    <path d="M12 14h6" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[#616161] text-lg">Our project is committed to</p>
                <p className="text-[#616161] text-lg">advancing the fourth point of SDGs</p>
              </div>
              <p className="text-[#616161] text-lg">
                We&apos;re building a platform where education truly belongs to{" "}
                <span className="text-[#ccffd0] font-semibold">everyone.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
