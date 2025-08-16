#!/bin/bash

# Backend Runner Script
echo "🚀 Starting Backend (Go/Gin)..."

# Navigate to backend directory
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

# Start the server
echo "🌐 Starting Go server..."
echo "Backend will be available at: http://localhost:8080"
go run main.go
