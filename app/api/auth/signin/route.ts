import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    })

    // If user doesn't exist, create them (for demo purposes)
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        },
      })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
