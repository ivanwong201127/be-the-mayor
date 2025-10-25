# Be The Mayor - Next.js Full-Stack Application

A modern Next.js application with authentication, database integration, and beautiful UI components built with TypeScript and Tailwind CSS.

## Features

- 🔐 **Authentication**: Secure user authentication with NextAuth.js
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🎨 **Modern UI**: Beautiful components with Tailwind CSS
- 📱 **Responsive**: Mobile-first responsive design
- 🔒 **Type Safety**: Full TypeScript support
- ⚡ **Performance**: Optimized with Next.js 16

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd be-the-mayor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/be_the_mayor?schema=public"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # JWT
   JWT_SECRET="your-jwt-secret-here"
   
   # App Configuration
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── user/         # User management endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── navigation.tsx     # Navigation component
│   └── providers.tsx     # Context providers
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   └── prisma.ts        # Prisma client
└── generated/           # Generated Prisma client
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

### User Management
- `GET /api/user/profile` - Get user profile

## Database Schema

The application uses Prisma with the following models:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Run database migrations

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset the database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## Deployment

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:

- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - A secure random string
- `JWT_SECRET` - A secure random string for JWT signing

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.