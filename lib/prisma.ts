import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Types for our application
export type UserWithMaterials = {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
  materials?: MaterialWithUploader[]
}

export type MaterialWithUploader = {
  id: string
  title: string
  description: string | null
  subject: string
  course: string
  year: string
  semester: string
  materialType: string
  fileType: string
  fileUrl: string
  fileSize: number | null
  uploadedBy: string
  downloads: number
  createdAt: Date
  updatedAt: Date
  uploader: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
  }
}

export type CreateMaterialData = {
  title: string
  description?: string
  subject: string
  course: string
  year: string
  semester: string
  materialType: string
  fileType: string
  fileUrl: string
  fileSize?: number
  uploadedBy: string
}

export type MaterialFilters = {
  search?: string
  course?: string
  year?: string
  semester?: string
  subject?: string
  materialType?: string
  limit?: number
  offset?: number
}
