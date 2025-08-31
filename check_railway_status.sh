#!/bin/bash

echo "🚂 AfterLight Railway Status Checker"
echo "===================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "❌ You are not logged in to Railway."
    echo "Login with: railway login"
    exit 1
fi

echo "✅ Railway CLI is installed and you are logged in"
echo ""

# Check if we're in a Railway project
if [ ! -f "backend/railway.json" ]; then
    echo "❌ Not in a Railway project directory"
    echo "Run: ./deploy_to_railway.sh to set up deployment"
    exit 1
fi

echo "📁 Railway project detected"
echo ""

# Go to backend directory and check status
cd backend

echo "🔍 Checking Railway service status..."
railway status

echo ""
echo "📊 Recent logs (last 10 lines):"
railway logs --tail 10

echo ""
echo "🌐 Service URL:"
railway domain

echo ""
echo "🔧 Environment variables:"
railway variables --show-values | head -20

echo ""
echo "✅ Status check complete!"
echo ""
echo "📚 Useful commands:"
echo "  railway logs          # View all logs"
echo "  railway up            # Deploy changes"
echo "  railway restart       # Restart service"
echo "  railway open          # Open in browser"
