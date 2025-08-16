#!/bin/bash

# Frontend Runner Script
echo "🚀 Starting Frontend (Next.js)..."

# Navigate to frontend directory
cd frontend

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start the development server
echo "🌐 Starting Next.js development server..."
echo "Frontend will be available at: http://localhost:3000"
npm run dev
