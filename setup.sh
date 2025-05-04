#!/bin/bash
set -e

echo "🚀 Setting up Leftovers Tracker project..."

# Install root dependencies
npm install

# Setup server
echo "📦 Setting up server..."
cd server
npm install
cd ..

# Setup client
echo "🖥️ Setting up client..."
cd client
npm install
cd ..

echo "✅ Setup complete! You can now start the development servers."
echo "   - Run 'npm run dev:server' to start the backend"
echo "   - Run 'npm run dev:client' to start the frontend"