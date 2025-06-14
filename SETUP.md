# StudyMate Setup Guide

## 🚀 Quick Start

### 1. Get Your Neon Database URLs

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or select existing one
3. Go to **Dashboard** → **Connection Details**
4. Copy your connection strings:
   - **Pooled connection** (for DATABASE_URL)
   - **Direct connection** (for DATABASE_URL_UNPOOLED)

### 2. Environment Variables

Your `.env.local` is already configured with:
\`\`\`env
DATABASE_URL="postgresql://neondb_owner:npg_PfJWsiqcZB81@ep-little-mode-a82u8p8j-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_PfJWsiqcZB81@ep-little-mode-a82u8p8j.eastus2.azure.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xvc2UtbW9sZS02MS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_CYlTqcgngTMlxtkcXxLNvdAHyiqGqR0e59oXXc9BaO
\`\`\`

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Setup Database with Prisma

\`\`\`bash
# Generate Prisma client
npm run db:generate

# Push schema to Neon database (creates all tables)
npm run db:push

# Seed database with sample data
npm run db:seed
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to Neon database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 🔧 Why Prisma Instead of SQL Scripts?

✅ **Type Safety**: Prisma generates TypeScript types automatically
✅ **Schema Management**: Single source of truth in `schema.prisma`
✅ **Migrations**: Automatic migration generation and management
✅ **Query Builder**: Intuitive API instead of raw SQL
✅ **Relationships**: Easy to define and query related data
✅ **Validation**: Built-in data validation and constraints

## 📊 Database Management

Use **Prisma Studio** for a visual database interface:
\`\`\`bash
npm run db:studio
\`\`\`

This opens a web interface at `http://localhost:5555` where you can:
- View and edit data
- Run queries
- Manage relationships
- Monitor database performance

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use different databases for development/production
- Rotate database passwords regularly
- Enable IP restrictions in Neon dashboard if needed
