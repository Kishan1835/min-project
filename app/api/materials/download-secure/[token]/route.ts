import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
    try {
        const { userId } = await auth();
        const downloadToken = params.token;

        if (!userId || !downloadToken) {
            return new NextResponse("Unauthorized or missing token", { status: 401 });
        }

        // Validate the token
        const tokenRecord = await prisma.downloadToken.findUnique({
            where: { token: downloadToken },
            include: { material: true },
        });

        if (!tokenRecord) {
            return new NextResponse("Invalid or expired download token", { status: 404 });
        }

        if (tokenRecord.userId !== userId) {
            return new NextResponse("Unauthorized: Token does not belong to this user", { status: 403 });
        }

        if (tokenRecord.expiresAt < new Date()) {
            // Invalidate expired token
            await prisma.downloadToken.delete({ where: { id: tokenRecord.id } });
            return new NextResponse("Download token has expired", { status: 403 });
        }

        // Invalidate token after first use (optional, but good for security)
        await prisma.downloadToken.delete({ where: { id: tokenRecord.id } });

        const material = tokenRecord.material;

        if (!material || !material.fileUrl) {
            return new NextResponse("Material not found or file URL missing", { status: 404 });
        }

        // Fetch the file from the fileUrl
        const fileResponse = await fetch(material.fileUrl);

        if (!fileResponse.ok) {
            console.error("Failed to fetch file from Vercel Blob:", fileResponse.status, fileResponse.statusText);
            return new NextResponse("Failed to retrieve file", { status: 500 });
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
        });

    } catch (error) {
        console.error("Secure file download error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
} 