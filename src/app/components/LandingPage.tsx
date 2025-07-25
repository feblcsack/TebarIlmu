"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import Link from "next/link"

const carouselImages = [
  {
    src: "/edu/1.jpeg",
    alt: "Modern workspace",
  },
  {
    src: "/edu/2.jpeg", 
    alt: "Team collaboration",
  },
  {
    src: "/carousel/3.JPG",
    alt: "Technology dashboard",
  },
  {
    src: "/carousel/4.JPG",
    alt: "Design studio",
  },
]

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="grid gap-8 lg:gap-12 xl:gap-16 lg:grid-cols-2 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-4">
            <div className="space-y-4 lg:space-y-3">
              <h1 className="text-xl sm:text-3xl md:text-2xl lg:text-2xl xl:text-4xl font-semibold tracking-tight text-zinc-100 leading-tight">
                Education is a right, not a
                
              </h1>
              <h1 className="block font-bold text-6xl text-zinc-300">
                  Privilege
                </h1>
              <p className="text-base sm:text-md lg:text-md text-zinc-400 max-w-2xl leading-relaxed">
              regardless of their background, economic status, etc deserves equal access to quality learning. Knowledge should be  inclusive.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href="/register">
  <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition duration-150">
    Join as Mentor
  </button>
</a>

              
              <button className="border-2 border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white hover:bg-zinc-800 px-4 py-2 text-base sm:text-sm font-semibold rounded-xl transition-all duration-200">
                Try it now
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-6 lg:pt-8">

  <div className="text-center sm:text-left">
    <div className="text-xl sm:text-2xl lg:text-xl xl:text-4xl font-bold text-white">
      100%
    </div>
    <div className="text-xs sm:text-sm text-zinc-400 mt-1">
      Free & Accessible
    </div>
  </div>

  <div className="text-center sm:text-left">
    <div className="text-xl sm:text-2xl lg:text-xl xl:text-4xl font-bold text-white">
      For Everyone
    </div>
    <div className="text-xs sm:text-sm text-zinc-400 mt-1">
      No requirements, just willingness to learn
    </div>
  </div>

  <div className="text-center sm:text-left">
    <div className="text-xl sm:text-xl lg:text-xl xl:text-4xl font-bold text-white">
      Online-Based
    </div>
    <div className="text-xs sm:text-sm text-zinc-400 mt-1">
      Learn from anywhere, anytime
    </div>
  </div>

</div>

          </div>

          {/* Right Carousel */}
          <div className="relative order-first lg:order-last">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-zinc-900 border border-zinc-700">
              
              {/* Carousel Container */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-[240px] xs:h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[480px] 2xl:h-[520px] object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-zinc-800/90 hover:bg-zinc-700 text-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-zinc-800/90 hover:bg-zinc-700 text-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-105"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                      index === currentSlide
                        ? "bg-white scale-110"
                        : "bg-zinc-500 hover:bg-zinc-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Auto-play Control */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="bg-zinc-800/90 hover:bg-zinc-700 text-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200"
                  aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isAutoPlaying ? (
                    <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Simple Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 sm:w-32 sm:h-32 bg-white/3 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}