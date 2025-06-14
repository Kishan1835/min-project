import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`

    // Get basic stats
    const userCount = await prisma.user.count()
    const materialCount = await prisma.material.count()
    const downloadCount = await prisma.download.count()

    // Test creating a sample query
    const recentMaterials = await prisma.material.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        uploader: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      status: "✅ Database Connected Successfully!",
      database: "Neon PostgreSQL",
      stats: {
        users: userCount,
        materials: materialCount,
        downloads: downloadCount,
      },
      recentMaterials: recentMaterials.length,
      connection: "Active",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json(
      {
        status: "❌ Database Connection Failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
