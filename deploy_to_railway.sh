#!/bin/bash

echo "🚂 AfterLight Backend Railway Deployment Script"
echo "==============================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "Please install it first:"
    echo "  npm install -g @railway/cli"
    echo "  # or"
    echo "  curl -fsSL https://railway.app/install.sh | sh"
    echo ""
    exit 1
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "❌ You are not logged in to Railway."
    echo "Please login first:"
    echo "  railway login"
    echo ""
    exit 1
fi

echo "✅ Railway CLI is installed and you are logged in"
echo ""

# Check if we're in the right directory
if [ ! -f "backend/railway.json" ]; then
    echo "❌ Please run this script from the project root directory"
    echo "Current directory: $(pwd)"
    echo "Expected files: backend/railway.json"
    echo ""
    exit 1
fi

echo "📁 Project structure verified"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "1. Deploy to new Railway project"
echo "2. Deploy to existing Railway project"
echo "3. View deployment status"
echo "4. Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Creating new Railway project..."
        echo ""
        
        # Create new project
        railway init --name "afterlight-backend" --directory backend
        
        echo ""
        echo "✅ Project created! Now you need to:"
        echo "1. Go to https://railway.app/dashboard"
        echo "2. Click on your new project"
        echo "3. Add a PostgreSQL database service"
        echo "4. Set environment variables (see backend/.env.example)"
        echo "5. Deploy your service"
        echo ""
        ;;
        
    2)
        echo ""
        echo "🔗 Linking to existing Railway project..."
        echo ""
        
        # Link to existing project
        cd backend
        railway link
        
        echo ""
        echo "✅ Project linked! Now you can deploy:"
        echo "  railway up"
        echo ""
        ;;
        
    3)
        echo ""
        echo "📊 Checking deployment status..."
        echo ""
        
        cd backend
        railway status
        
        echo ""
        echo "For detailed logs:"
        echo "  railway logs"
        echo ""
        ;;
        
    4)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
        
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Next steps:"
echo "1. Set required environment variables in Railway dashboard:"
echo "   - DATABASE_URL (from PostgreSQL service)"
echo "   - JWT_SECRET (generate a secure random string)"
echo "   - OPENAI_API_KEY (if using AI features)"
echo ""
echo "2. Deploy your service:"
echo "   cd backend && railway up"
echo ""
echo "3. Check deployment:"
echo "   railway status"
echo "   railway logs"
echo ""
echo "4. Get your API URL:"
echo "   railway domain"
echo ""
echo "�� Happy deploying!"
