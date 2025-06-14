import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { MaterialFilters, CreateMaterialData } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: MaterialFilters = {
      search: searchParams.get("search") || undefined,
      course: searchParams.get("course") || undefined,
      year: searchParams.get("year") || undefined,
      semester: searchParams.get("semester") || undefined,
      subject: searchParams.get("subject") || undefined,
      materialType: searchParams.get("material_type") || undefined,
      limit: Number.parseInt(searchParams.get("limit") || "50"),
      offset: Number.parseInt(searchParams.get("offset") || "0"),
    }

    // Build where clause
    const where: any = {}

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { subject: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    if (filters.course) where.course = filters.course
    if (filters.year) where.year = filters.year
    if (filters.semester) where.semester = filters.semester
    if (filters.subject) where.subject = filters.subject
    if (filters.materialType) where.materialType = filters.materialType

    const materials = await prisma.material.findMany({
      where,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: filters.limit,
      skip: filters.offset,
    })

    return NextResponse.json({ materials })
  } catch (error) {
    console.error("Get materials error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clerkUser = await currentUser()

    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Ensure user exists in our database
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "User",
        avatarUrl: clerkUser.imageUrl,
      },
      create: {
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "User",
        avatarUrl: clerkUser.imageUrl,
      },
    })

    const data: CreateMaterialData = await request.json()

    const { title, description, subject, course, year, semester, materialType, fileType, fileUrl, fileSize } = data

    if (!title || !subject || !course || !year || !semester || !materialType || !fileType || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const material = await prisma.material.create({
      data: {
        title,
        description,
        subject,
        course,
        year,
        semester,
        materialType,
        fileType,
        fileUrl,
        fileSize,
        uploadedBy: userId,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    })

    return NextResponse.json({ material })
  } catch (error) {
    console.error("Create material error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
