#!/bin/bash

# Be The Mayor - Environment Setup Script

echo "🚀 Setting up Be The Mayor environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/be_the_mayor?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# JWT
JWT_SECRET="$(openssl rand -base64 32)"

# App Configuration
NODE_ENV="development"
EOL
    echo "✅ .env file created with secure random secrets"
else
    echo "⚠️  .env file already exists, skipping creation"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update DATABASE_URL in .env with your PostgreSQL connection string"
echo "2. Run 'npx prisma migrate dev' to set up your database"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000 in your browser"
