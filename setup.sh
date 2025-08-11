#!/bin/bash

echo "�� Setting up E-Commerce Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start PostgreSQL database
echo "📦 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Backend setup
echo "🔧 Setting up backend..."
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration (AWS S3, JWT secret, etc.)"
else
    echo "✅ Backend .env file already exists"
fi

# Frontend setup
echo "🔧 Setting up frontend..."
cd ../frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
    echo "✅ Frontend .env file created"
else
    echo "✅ Frontend .env file already exists"
fi

cd ..

echo ""
echo "�� Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your AWS S3 credentials and JWT secret"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: cd frontend && npm start"
echo "4. Access the application at http://localhost:3000"
echo ""
echo "🔑 Demo accounts (after running migrations and seeds):"
echo "   Admin: admin@example.com / admin123"
echo "   User: user@example.com / user123"
echo ""
echo "📚 For more information, see README.md"
