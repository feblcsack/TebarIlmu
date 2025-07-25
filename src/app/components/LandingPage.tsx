"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const carouselImages = [
  {
    src: "/carousel/belajar.jpg",
    alt: "Modern workspace",
  },
  {
    src: "/carousel/belajar2.jpg", 
    alt: "Team collaboration",
  },
  {
    src: "/edu/1.jpeg",
    alt: "Technology dashboard",
  },
  {
    src: "/edu/2.jpeg",
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
    <section className="min-h-screen bg-white text-gray-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center min-h-[75vh]">
        
        {/* Left Content */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-700 leading-tight">
              Education is a right, not a
            </h1>
            <Image src="/Privilege.png" alt="Logo" width={300} height={300} />
            <p className="text-base lg:text-lg text-gray-600 max-w-xl leading-relaxed">
              Everyone deserves equal access to quality learning, regardless of background or economic status. Knowledge should be <span className="italic text-green-00 font-semibold"> inclusive.</span> 
            </p>
          </div>
  
          {/* Buttons */}
          <div className="flex flex-row sm:flex-row gap-3">
            <a href="/register">
            <button className="bg-gradient-to-r from-green-100 via-green-200 to-green-400 text-green-900 px-4 py-2 text-sm font-medium rounded-md transition duration-200 shadow-sm hover:shadow-md">
  Join as Mentor
</button>


            </a>
            <a href="#hero">
            <button className="border-2 border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-800 hover:bg-blue-50 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200">
              Try it now
            </button>
            </a>
           
          </div>
  
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 lg:gap-6 pt-6 border-t border-gray-200">
            <div className="text-center sm:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-green-500">
                100%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Free & Accessible
              </div>
            </div>
  
            <div className="text-center sm:text-left">
              <div className="text-lg lg:text-xl font-bold text-green-500">
                For Everyone
              </div>
              <div className="text-sm text-gray-600 mt-1">
                No requirements needed
              </div>
            </div>
  
            <div className="text-center sm:text-left">
              <div className="text-lg lg:text-xl font-bold text-green-500">
                Online-Based
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Learn anywhere
              </div>
            </div>
          </div>
        </div>
  
        {/* Right Carousel */}
        <div className="relative order-first lg:order-last">
          <div className="relative overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200">
            
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
                    className="w-full h-[280px] sm:h-[320px] lg:h-[380px] xl:h-[420px] object-cover"
                  />
                </div>
              ))}
            </div>
  
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
  
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
  
            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? "bg-white scale-110"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
  
            {/* Auto-play Control */}
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-all duration-200"
                aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isAutoPlaying ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
  
          {/* Subtle Decorative Elements */}
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-blue-100 rounded-full blur-xl opacity-60 -z-10" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-50 rounded-full blur-xl opacity-40 -z-10" />
        </div>
      </div>
    </div>
  </section>
  )
}