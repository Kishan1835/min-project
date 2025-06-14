"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Loader2 } from "lucide-react"
import { SignInButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import type { CreateMaterialData } from "@/lib/prisma"

export default function UploadPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    year: "",
    semester: "",
    subject: "",
    type: "",
    description: "",
    file: null as File | null,
  })

  const courses = ["MCA", "B.Tech", "B.Sc", "M.Tech", "BCA", "MBA", "M.Sc"]
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]
  const materialTypes = ["Notes", "Question Paper", "Assignment", "Project", "Image"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn || !user) return

    if (!formData.file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Upload file to Vercel Blob
      const uploadResponse = await fetch(`/api/upload?filename=${formData.file.name}`, {
        method: 'POST',
        body: formData.file,
      })

      if (!uploadResponse.ok) {
        throw new Error("File upload to Vercel Blob failed")
      }

      const blob = await uploadResponse.json()
      const fileUrl = blob.url
      const fileType = formData.file.name.split(".").pop()?.toLowerCase() || "pdf"

      const materialData: CreateMaterialData = {
        title: formData.title,
        description: formData.description || undefined,
        subject: formData.subject,
        course: formData.course,
        year: formData.year,
        semester: formData.semester,
        materialType: formData.type,
        fileType: fileType,
        fileUrl: fileUrl,
        fileSize: formData.file.size,
        uploadedBy: user.id,
      }

      // Submit material data to your API
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(materialData),
      })

      if (!response.ok) {
        throw new Error("Material data submission failed")
      }

      toast({
        title: "Upload Successful!",
        description: "Your study material has been uploaded successfully.",
      })

      // Reset form
      setFormData({
        title: "",
        course: "",
        year: "",
        semester: "",
        subject: "",
        type: "",
        description: "",
        file: null,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: `There was an error uploading your material: ${(error as Error).message}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
        "image/jpg",
      ]

      if (allowedTypes.includes(file.type)) {
        setFormData((prev) => ({ ...prev, file }))
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, Word documents, or images only.",
          variant: "destructive",
        })
      }
    }
  }

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    )
  }

  if (!isSignedIn) {
    return (
      <AppLayout>
        <div className="container px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="gradient-bg p-4 rounded-full w-16 h-16 mx-auto mb-6">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-6">You need to be signed in to upload study materials.</p>
            <SignInButton mode="modal">
              <Button className="gradient-bg">Sign In to Continue</Button>
            </SignInButton>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Upload Study Material</h1>
            <p className="text-gray-600">Share your notes and help fellow students</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Material Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Data Structures Complete Notes"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="course">Course *</Label>
                    <Select
                      value={formData.course}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, course: value }))}
                    >
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
                    <Label htmlFor="year">Year *</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, year: value }))}
                    >
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="semester">Semester *</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: value }))}
                    >
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
                    <Label htmlFor="type">Material Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
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
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Data Structures and Algorithms"
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="file">Upload File *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, Word documents (.doc, .docx), Images (.png, .jpg)
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the material..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full gradient-bg" disabled={isUploading}>
                  {isUploading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Material
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
