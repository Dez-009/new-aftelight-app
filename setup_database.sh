#!/bin/bash

echo "🚀 AfterLight Database Setup"
echo "=============================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Install required packages
echo "📦 Installing required packages..."
pip3 install psycopg2-binary

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to install psycopg2-binary. Trying alternative..."
    pip3 install psycopg2
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install psycopg2. Please install it manually:"
        echo "   pip3 install psycopg2-binary"
        exit 1
    fi
fi

echo "✅ Dependencies installed successfully!"

# Run the database initialization
echo "🗄️  Initializing database..."
python3 database/init_db.py

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Database setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Your database is now ready with all tables"
    echo "2. You can start building the Personas Knowledge Base frontend"
    echo "3. The database includes subscription tiers and vector embedding support"
    echo ""
    echo "Default super admin:"
    echo "   Email: superadmin@afterlight.com"
    echo "   Password: superadmin123"
    echo "   ⚠️  Change this password immediately in production!"
else
    echo ""
    echo "❌ Database setup failed. Please check the error messages above."
    echo ""
    echo "Common issues:"
    echo "1. Database server not running"
    echo "2. Incorrect connection details"
    echo "3. Insufficient permissions"
    echo ""
    echo "Need help? Check the database/README.md file for troubleshooting."
    exit 1
fi
