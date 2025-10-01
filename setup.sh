#!/bin/bash

# Dog Breeds Explorer - Setup Script
echo "🐕 Setting up Dog Breeds Explorer..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ All dependencies installed successfully!"
echo ""
echo "🚀 To start the application, run:"
echo "   npm run dev"
echo ""
echo "This will start:"
echo "   - Backend server on http://localhost:3001"
echo "   - Frontend server on http://localhost:3000"
echo ""
echo "📚 For more information, see README.md"
