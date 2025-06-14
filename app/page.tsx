import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Upload, Search, Download, BookOpen, FileText, Users } from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: Upload,
      title: "Upload Notes & Question Papers",
      description: "Share your study materials with fellow students easily",
    },
    {
      icon: Search,
      title: "Search by Subject, Semester, Course",
      description: "Find exactly what you need with powerful search filters",
    },
    {
      icon: Download,
      title: "Download Previous Year Papers",
      description: "Access a vast collection of previous examination papers",
    },
    {
      icon: BookOpen,
      title: "Organized by Course & Semester",
      description: "Materials are systematically organized for easy access",
    },
    {
      icon: FileText,
      title: "Multiple File Formats",
      description: "Support for PDFs, Word documents, and images",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by students, for students - grow together",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10" />
        <div className="relative container px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <span className="gradient-text">StudyMate:</span>
              <br />
              College Resource Hub
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Find, Upload, and Share Study Materials With Your Peers. Access thousands of notes, question papers, and
              study resources from students across different courses and semesters.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <SignInButton mode="modal">
                <Button size="lg" className="gradient-bg text-white px-8 py-3">
                  Login to Continue
                </Button>
              </SignInButton>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard">Browse Materials</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to excel in your studies
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive platform designed specifically for college students
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="card-hover border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="gradient-bg p-3 rounded-lg">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to boost your academic performance?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of students who are already sharing and accessing study materials
            </p>
            <div className="mt-8">
              <SignUpButton mode="modal">
                <Button size="lg" variant="secondary" className="px-8 py-3">
                  Get Started Free
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="gradient-bg p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">StudyMate</span>
            </div>
            <p className="text-gray-600">Empowering students through collaborative learning</p>
            <p className="mt-2 text-sm text-gray-500">© 2024 StudyMate. Built with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
