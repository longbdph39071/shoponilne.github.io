#!/bin/bash

echo "🚀 Starting Admin Dashboard..."

# Kill existing processes
echo "🔄 Stopping existing processes..."
pkill -f "json-server" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Wait a moment
sleep 2

# Start backend server
echo "🔧 Starting backend server (port 3000)..."
npx json-server --watch db.json --port 3000 --middlewares ./node_modules/json-server-auth &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Test backend
echo "🧪 Testing backend..."
if curl -s http://localhost:3000/users > /dev/null; then
    echo "✅ Backend is running on http://localhost:3000"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend (port 5173)..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Test frontend
echo "🧪 Testing frontend..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend is running on http://localhost:5173"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

echo ""
echo "🎉 All services are running!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3000"
echo "🧪 Test Page: http://localhost:5173/test"
echo "📋 Debug Page: http://localhost:5173/debug.html"
echo ""
echo "👤 Demo Accounts:"
echo "   Admin: admin@company.com / 123456"
echo "   Staff: staff@company.com / 123456"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait 