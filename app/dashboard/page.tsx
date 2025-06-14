"use client"

import { useState, useEffect } from "react"
import { useUser, SignInButton } from "@clerk/nextjs"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Download, Eye, FileText, ImageIcon, File, Filter, Calendar, Loader2 } from "lucide-react"
import type { MaterialWithUploader } from "@/lib/prisma"

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const { toast } = useToast()
  const [materials, setMaterials] = useState<MaterialWithUploader[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedType, setSelectedType] = useState("")

  const courses = ["MCA", "B.Tech", "B.Sc", "M.Tech", "BCA", "MBA"]
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]
  const subjects = [
    "Data Structures",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Machine Learning",
    "Web Development",
    "Mobile Computing",
  ]
  const materialTypes = ["Notes", "Question Paper", "Assignment", "Project", "Image"]

  // Sync user with database when they sign in
  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        try {
          await fetch("/api/auth/sync-user", {
            method: "POST",
          })
        } catch (error) {
          console.error("Failed to sync user:", error)
        }
      }
    }

    if (isLoaded) {
      syncUser()
    }
  }, [isSignedIn, user, isLoaded])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchTerm) params.append("search", searchTerm)
      if (selectedCourse) params.append("course", selectedCourse)
      if (selectedYear) params.append("year", selectedYear)
      if (selectedSemester) params.append("semester", selectedSemester)
      if (selectedSubject) params.append("subject", selectedSubject)
      if (selectedType) params.append("material_type", selectedType)

      const response = await fetch(`/api/materials?${params}`)
      if (!response.ok) throw new Error("Failed to fetch materials")

      const { materials } = await response.json()
      setMaterials(materials)
    } catch (error) {
      console.error("Error fetching materials:", error)
      toast({
        title: "Error",
        description: "Failed to load materials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [searchTerm, selectedCourse, selectedYear, selectedSemester, selectedSubject, selectedType])

  const handleDownload = async (materialId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/materials/${materialId}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast({
          title: "Download Started",
          description: "Your download has been recorded.",
        })
        // Refresh materials to update download count
        fetchMaterials()
      }
    } catch (error) {
      console.error("Download error:", error)
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "doc":
      case "docx":
        return <File className="h-5 w-5 text-blue-500" />
      case "png":
      case "jpg":
        return <ImageIcon className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Notes":
        return "bg-blue-100 text-blue-800"
      case "Question Paper":
        return "bg-red-100 text-red-800"
      case "Assignment":
        return "bg-green-100 text-green-800"
      case "Project":
        return "bg-purple-100 text-purple-800"
      case "Image":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCourse("")
    setSelectedYear("")
    setSelectedSemester("")
    setSelectedSubject("")
    setSelectedType("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <AppLayout className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Study Materials Dashboard</h1>
          <p className="text-gray-600">Discover and access study materials from your peers</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by subject or file name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={clearFilters} className="text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <p className="text-sm text-gray-600">Showing {materials.length} materials</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading materials...</span>
          </div>
        )}

        {/* Materials Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Card key={material.id} className="card-hover shadow-lg border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      {getFileIcon(material.fileType)}
                      <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">{material.title}</CardTitle>
                    </div>
                    <Badge className={getTypeColor(material.materialType)}>{material.materialType}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Subject:</span>
                      <span>{material.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Course:</span>
                      <span>{material.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Year:</span>
                      <span>{material.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Semester:</span>
                      <span>{material.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Uploaded by:</span>
                      <span>{material.uploader.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Downloads:</span>
                      <span className="text-green-600 font-semibold">{material.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(material.createdAt.toString())}
                  </div>

                  {isSignedIn ? (
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDownload(material.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <SignInButton mode="modal">
                        <Button size="sm" className="w-full gradient-bg">
                          Sign In to Access
                        </Button>
                      </SignInButton>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && materials.length === 0 && (
          <div className="text-center py-12">
            <div className="gradient-bg p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
