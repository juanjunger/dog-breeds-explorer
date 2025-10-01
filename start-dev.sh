#!/bin/bash

# Dog Breeds Explorer - Development Script
echo "🐕 Starting Dog Breeds Explorer..."

# Check if concurrently is installed
if ! npm list concurrently > /dev/null 2>&1; then
    echo "📦 Installing concurrently..."
    npm install concurrently --save-dev
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "🚀 Starting development servers..."
echo "   - Backend: http://localhost:3001"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers
npm run dev
