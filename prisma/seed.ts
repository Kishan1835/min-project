import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "john.doe@example.com" },
      update: {},
      create: {
        email: "john.doe@example.com",
        name: "John Doe",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
    }),
    prisma.user.upsert({
      where: { email: "jane.smith@example.com" },
      update: {},
      create: {
        email: "jane.smith@example.com",
        name: "Jane Smith",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
    }),
    prisma.user.upsert({
      where: { email: "mike.johnson@example.com" },
      update: {},
      create: {
        email: "mike.johnson@example.com",
        name: "Mike Johnson",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      },
    }),
    prisma.user.upsert({
      where: { email: "sarah.wilson@example.com" },
      update: {},
      create: {
        email: "sarah.wilson@example.com",
        name: "Sarah Wilson",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
    }),
    prisma.user.upsert({
      where: { email: "alex.brown@example.com" },
      update: {},
      create: {
        email: "alex.brown@example.com",
        name: "Alex Brown",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      },
    }),
    prisma.user.upsert({
      where: { email: "emma.davis@example.com" },
      update: {},
      create: {
        email: "emma.davis@example.com",
        name: "Emma Davis",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create materials
  const materials = [
    {
      title: "Data Structures and Algorithms - Complete Notes",
      description: "Comprehensive notes covering all DSA topics including arrays, linked lists, trees, and graphs.",
      subject: "Data Structures",
      course: "MCA",
      year: "1st Year",
      semester: "2",
      materialType: "Notes",
      fileType: "pdf",
      fileUrl: "/placeholder-files/dsa-notes.pdf",
      fileSize: 2048576,
      uploadedBy: users[0].id,
      downloads: 245,
    },
    {
      title: "Database Management Systems - Mid Term Paper",
      description: "Previous year mid-term examination paper with solutions.",
      subject: "DBMS",
      course: "B.Tech",
      year: "2nd Year",
      semester: "4",
      materialType: "Question Paper",
      fileType: "pdf",
      fileUrl: "/placeholder-files/dbms-paper.pdf",
      fileSize: 1024768,
      uploadedBy: users[1].id,
      downloads: 189,
    },
    {
      title: "Operating Systems Concepts - Lecture Notes",
      description: "Detailed lecture notes on OS concepts, processes, and memory management.",
      subject: "Operating Systems",
      course: "B.Sc",
      year: "3rd Year",
      semester: "5",
      materialType: "Notes",
      fileType: "docx",
      fileUrl: "/placeholder-files/os-notes.docx",
      fileSize: 1536000,
      uploadedBy: users[2].id,
      downloads: 156,
    },
    {
      title: "Network Topology Diagram",
      description: "Visual representation of different network topologies with explanations.",
      subject: "Computer Networks",
      course: "MCA",
      year: "2nd Year",
      semester: "3",
      materialType: "Image",
      fileType: "png",
      fileUrl: "/placeholder-files/network-diagram.png",
      fileSize: 512000,
      uploadedBy: users[3].id,
      downloads: 78,
    },
    {
      title: "Software Engineering - Project Report Template",
      description: "Standard template for software engineering project reports.",
      subject: "Software Engineering",
      course: "B.Tech",
      year: "3rd Year",
      semester: "6",
      materialType: "Project",
      fileType: "doc",
      fileUrl: "/placeholder-files/se-template.doc",
      fileSize: 768000,
      uploadedBy: users[4].id,
      downloads: 134,
    },
    {
      title: "Machine Learning Assignment - Linear Regression",
      description: "Assignment on linear regression with Python implementation.",
      subject: "Machine Learning",
      course: "MCA",
      year: "2nd Year",
      semester: "4",
      materialType: "Assignment",
      fileType: "pdf",
      fileUrl: "/placeholder-files/ml-assignment.pdf",
      fileSize: 1280000,
      uploadedBy: users[5].id,
      downloads: 92,
    },
  ]

  for (const material of materials) {
    await prisma.material.create({
      data: material,
    })
  }

  console.log(`✅ Created ${materials.length} materials`)
  console.log("🎉 Seeding completed!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
