# Study Material Portal

A modern web application for managing and accessing study materials, built with Next.js.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/thearc3000-gmailcoms-projects/v0-study-material-portal-design)

## Overview

This is a full-stack web application that provides a platform for students and educators to share and access study materials. Built with modern web technologies, it offers a seamless user experience and robust functionality.

## Features

- User authentication and authorization
- Material upload and management
- Search and filter capabilities
- Responsive design for all devices
- Real-time updates
- Secure file storage

## Prerequisites

- Node.js (version 16.14 or higher)
- npm or pnpm
- PostgreSQL database (Neon DB recommended)
- Clerk account (for authentication)
- Vercel account (for deployment)

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (Neon DB)
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname"
DATABASE_URL_UNPOOLED="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Setting up required services:

1. **Neon DB Setup**:

   - Go to [Neon DB](https://neon.tech)
   - Create a new project
   - Get your connection strings from the dashboard
   - Copy both pooled and unpooled connection URLs to your `.env` file

2. **Clerk Authentication Setup**:

   - Go to [Clerk Dashboard](https://dashboard.clerk.dev)
   - Create a new application
   - Get your API keys from the dashboard
   - Copy the Publishable Key and Secret Key to your `.env` file
   - Configure your application settings in the Clerk dashboard:
     - Set up your sign-in and sign-up pages
     - Configure redirect URLs
     - Set up email templates if needed

3. **Vercel Blob Storage**:

   - Go to Vercel Dashboard > Storage > Blob
   - Create a new Blob store
   - Generate a new token
   - Copy the token to your `.env` file

## Local Development Setup

1. Clone the repository:

```bash
git clone <your-repository-url>
cd min-project
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `/app` - Next.js app directory containing pages and API routes
- `/components` - Reusable UI components
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/styles` - Global styles and CSS modules
- `/lib` - Utility functions and shared code
- `/hooks` - Custom React hooks

## Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run lint` - Run ESLint to check code quality and style

### Database Management

1. `npx prisma generate` - Generate Prisma client (run this after schema changes)
2. `npx prisma db push` - Push schema changes to database
3. `npx prisma studio` - Open Prisma database GUI to view and manage data

### Production

- `npm run build` - Build for production
- `npm start` - Start production server

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Troubleshooting

If you encounter any issues:

1. Make sure all environment variables are properly set
2. Verify database connection strings
3. Check if all required services are running
4. Clear npm cache: `npm cache clean --force`
5. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
6. Run Prisma generate: `npx prisma generate`
