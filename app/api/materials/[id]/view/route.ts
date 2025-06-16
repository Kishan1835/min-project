import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth()
        const materialId = params.id

        if (!userId || !materialId) {
            return new NextResponse("Unauthorized or missing material ID", { status: 401 })
        }

        const material = await prisma.material.findUnique({
            where: { id: materialId },
            select: { fileUrl: true },
        })

        if (!material || !material.fileUrl) {
            return new NextResponse("Material not found or file URL missing", { status: 404 })
        }

        // Redirect to the file URL
        return NextResponse.redirect(material.fileUrl)

    } catch (error) {
        console.error("View material error:", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
} 