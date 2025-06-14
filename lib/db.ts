import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Material {
  id: string
  title: string
  description?: string
  subject: string
  course: string
  year: string
  semester: string
  material_type: string
  file_type: string
  file_url: string
  file_size?: number
  uploaded_by: string
  uploader_name?: string
  uploader_email?: string
  downloads: number
  created_at: string
  updated_at: string
}

export interface CreateMaterialData {
  title: string
  description?: string
  subject: string
  course: string
  year: string
  semester: string
  material_type: string
  file_type: string
  file_url: string
  file_size?: number
  uploaded_by: string
}

export interface MaterialFilters {
  search?: string
  course?: string
  year?: string
  semester?: string
  subject?: string
  material_type?: string
  limit?: number
  offset?: number
}
