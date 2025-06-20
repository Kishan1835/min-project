import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = (await auth())
    const materialId = params.id

    if (!userId || !materialId) {
      return NextResponse.json({ error: "Unauthorized or missing material ID" }, { status: 400 })
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

    // Use a transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // Record the download
      await tx.download.create({
        data: {
          materialId,
          userId,
        },
      })

      // Increment download count
      await tx.material.update({
        where: { id: materialId },
        data: { downloads: { increment: 1 } },
      })
    })

    // Generate a secure, short-lived token for download
    const token = uuidv4();
    const expiresAt = addMinutes(new Date(), 5); // Token valid for 5 minutes

    await prisma.downloadToken.create({
      data: {
        token,
        materialId,
        userId,
        expiresAt,
      },
    });

    return NextResponse.json({ success: true, token })

  } catch (error) {
    console.error("Download tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
