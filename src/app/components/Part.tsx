import { Button } from "../components/ui/button"

export default function EducationLanding() {
  return (
    <div className="min-h-screen 
 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto space-y-8">
        {/* Header text */}
        <p className="text-gray-500 text-sm font-medium">Be a part of us !</p>

        {/* Main heading */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Make Education</h1>
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-green-500">
              Accessible
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-medium mt-4">For Everyone</p>
        </div>

        {/* Call to action */}
        <div className="space-y-3">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full text-base shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            Sign Up as Student
          </Button>
          <p className="text-gray-400 text-xs">or are you a volunteer mentor?</p>
        </div>
      </div>
    </div>
  )
}
