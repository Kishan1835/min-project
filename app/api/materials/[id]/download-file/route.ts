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
            select: { fileUrl: true, title: true, fileType: true },
        })

        if (!material || !material.fileUrl) {
            return new NextResponse("Material not found or file URL missing", { status: 404 })
        }

        // Fetch the file from the fileUrl
        const fileResponse = await fetch(material.fileUrl)

        if (!fileResponse.ok) {
            console.error("Failed to fetch file from Vercel Blob:", fileResponse.status, fileResponse.statusText)
            return new NextResponse("Failed to retrieve file", { status: 500 })
        }

        // Determine content type and suggested filename
        const contentType = fileResponse.headers.get("Content-Type") || `application/${material.fileType}`;
        const filename = `${material.title}.${material.fileType}`;

        // Return the file as a response, forcing download
        return new NextResponse(fileResponse.body, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        })

    } catch (error) {
        console.error("Secure file download error:", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
} 