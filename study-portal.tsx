"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Download, Eye, Upload, BookOpen, FileText, GraduationCap, Filter } from "lucide-react"

interface StudyMaterial {
  id: string
  title: string
  type: "Notes" | "Question Paper"
  subject: string
  course: string
  year: string
  semester: string
  uploadedBy: string
  uploadDate: string
}

const mockMaterials: StudyMaterial[] = [
  {
    id: "1",
    title: "Data Structures and Algorithms - Complete Notes",
    type: "Notes",
    subject: "Data Structures",
    course: "MCA",
    year: "First Year",
    semester: "2",
    uploadedBy: "Prof. Smith",
    uploadDate: "2024-01-15",
  },
  {
    id: "2",
    title: "Database Management Systems - Mid Term Paper",
    type: "Question Paper",
    subject: "DBMS",
    course: "B.Tech",
    year: "Second Year",
    semester: "4",
    uploadedBy: "Dr. Johnson",
    uploadDate: "2024-01-10",
  },
  {
    id: "3",
    title: "Operating Systems Concepts - Lecture Notes",
    type: "Notes",
    subject: "Operating Systems",
    course: "B.Sc",
    year: "Third Year",
    semester: "5",
    uploadedBy: "Prof. Davis",
    uploadDate: "2024-01-08",
  },
  {
    id: "4",
    title: "Computer Networks - Final Exam Paper 2023",
    type: "Question Paper",
    subject: "Computer Networks",
    course: "MCA",
    year: "Second Year",
    semester: "3",
    uploadedBy: "Dr. Wilson",
    uploadDate: "2024-01-05",
  },
  {
    id: "5",
    title: "Software Engineering - Project Guidelines",
    type: "Notes",
    subject: "Software Engineering",
    course: "B.Tech",
    year: "Third Year",
    semester: "6",
    uploadedBy: "Prof. Brown",
    uploadDate: "2024-01-03",
  },
  {
    id: "6",
    title: "Machine Learning Basics - Assignment Questions",
    type: "Question Paper",
    subject: "Machine Learning",
    course: "MCA",
    year: "Second Year",
    semester: "4",
    uploadedBy: "Dr. Taylor",
    uploadDate: "2024-01-01",
  },
]

export default function StudyPortal() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const courses = ["MCA", "B.Tech", "B.Sc", "M.Tech", "BCA"]
  const years = ["First Year", "Second Year", "Third Year", "Fourth Year"]
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
  const materialTypes = ["Notes", "Question Paper"]

  const filteredMaterials = mockMaterials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = !selectedCourse || material.course === selectedCourse
    const matchesYear = !selectedYear || material.year === selectedYear
    const matchesSemester = !selectedSemester || material.semester === selectedSemester
    const matchesSubject = !selectedSubject || material.subject === selectedSubject
    const matchesType = !selectedType || material.type === selectedType

    return matchesSearch && matchesCourse && matchesYear && matchesSemester && matchesSubject && matchesType
  })

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCourse("")
    setSelectedYear("")
    setSelectedSemester("")
    setSelectedSubject("")
    setSelectedType("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">StudyMate</h1>
                <p className="text-sm text-gray-600">College Resource Hub</p>
              </div>
            </div>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Material
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Study Material</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter material title" />
                  </div>
                  <div>
                    <Label htmlFor="file">File Upload</Label>
                    <Input id="file" type="file" accept=".pdf,.doc,.docx" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="upload-course">Course</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="upload-year">Year</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="upload-semester">Semester</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((semester) => (
                            <SelectItem key={semester} value={semester}>
                              Semester {semester}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="upload-type">Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
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
                  </div>
                  <div>
                    <Label htmlFor="upload-subject">Subject</Label>
                    <Input id="upload-subject" placeholder="Enter subject name" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea id="description" placeholder="Brief description of the material" />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Upload Material
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Subject or Topic"
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
                  <SelectValue placeholder="Material Type" />
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

            {/* Clear Filters Button */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={clearFilters} className="text-sm">
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              <p className="text-sm text-gray-600">Showing {filteredMaterials.length} materials</p>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">{material.title}</CardTitle>
                  <Badge
                    variant={material.type === "Notes" ? "default" : "destructive"}
                    className={material.type === "Notes" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}
                  >
                    {material.type === "Notes" ? (
                      <BookOpen className="h-3 w-3 mr-1" />
                    ) : (
                      <FileText className="h-3 w-3 mr-1" />
                    )}
                    {material.type}
                  </Badge>
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
                    <span>{material.uploadedBy}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </main>
    </div>
  )
}
