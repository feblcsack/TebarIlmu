import { Award, Wifi } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import Image from "next/image"

export default function Component() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="text-gray-600 text-lg font-medium">Introducing you to,</h1>

          {/* Logo */}
          <div className="flex justify-center">
            <Image src="/logo/logo.png" alt="Logo" width={100} height={100} />
          </div>

          <p className="text-gray-600 text-sm">Our main features includes</p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Online Classes Card */}
          <Card className="bg-green-100 border-green-200 rounded-2xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-200 rounded-full p-3">
                  <Wifi className="w-6 h-6 text-green-700" />
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 text-lg">Online Classes</h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                Learn from anywhere, anytime with our comprehensive online learning platform. Access quality education
                from expert instructors.
              </p>

              <Button variant="link" className="text-green-700 hover:text-green-800 p-0 h-auto font-medium">
                Explore Classes
              </Button>
              <p className="text-xs text-gray-500">Start your learning journey today</p>
            </CardContent>
          </Card>

          {/* Scholarship Card */}
          <Card className="bg-green-100 border-green-200 rounded-2xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-200 rounded-full p-3">
                  <Award className="w-6 h-6 text-green-700" />
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 text-lg">Scholarship</h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                Apply for financial aid and scholarships to support your educational goals. We believe education should
                be accessible to everyone.
              </p>

              <Button variant="link" className="text-green-700 hover:text-green-800 p-0 h-auto font-medium">
                Request Scholarship
              </Button>
              <p className="text-xs text-gray-500">Get financial support for your studies</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
