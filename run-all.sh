#!/bin/bash

# Full Stack Runner Script
echo "🚀 Starting Full Stack Application (Frontend + Backend)..."

# Function to cleanup background processes on exit
cleanup() {
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend in background
echo "🌐 Starting Backend (Go/Gin)..."
cd backend

# Check if .env file exists, if not copy from example
if [ ! -f ".env" ]; then
    echo "📋 Creating .env file from example..."
    cp env.example .env
    echo "⚠️  Please configure your .env file with your database settings"
fi

# Download Go dependencies if needed
echo "📦 Checking Go dependencies..."
go mod tidy

# Start backend server in background
go run main.go &
BACKEND_PID=$!
echo "✅ Backend started with PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "🌐 Starting Frontend (Next.js)..."
cd ../frontend

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend server in background
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started with PID: $FRONTEND_PID"

echo ""
echo "🎉 Full Stack Application is running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
