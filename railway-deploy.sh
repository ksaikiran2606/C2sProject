#!/bin/bash
# Railway Deployment Script for GitHub
# This script helps deploy from GitHub repository

echo "========================================"
echo "  Railway Deployment from GitHub"
echo "========================================"
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "Railway CLI not found. Install from: https://docs.railway.app/develop/cli"
    exit 1
fi

# Login check
echo "Checking Railway login..."
railway whoami
if [ $? -ne 0 ]; then
    echo "Please login to Railway first:"
    echo "  railway login"
    exit 1
fi

echo ""
echo "Creating Railway project from GitHub..."
echo "Repository: https://github.com/ksaikiran2606/C2sProject.git"
echo ""

# Navigate to backend
cd backend

# Initialize Railway
railway init

# Add PostgreSQL
echo "Adding PostgreSQL..."
railway add postgresql

# Add Redis
echo "Adding Redis..."
railway add redis

# Generate secret key
SECRET_KEY=$(openssl rand -base64 32)

# Set environment variables
echo "Setting environment variables..."
railway variables set SECRET_KEY="$SECRET_KEY"
railway variables set DEBUG=False
railway variables set USE_POSTGRES=True
railway variables set ALLOWED_HOSTS="*.railway.app"

# Deploy
echo ""
echo "Deploying to Railway..."
railway up

# Get URL
echo ""
echo "Getting deployment URL..."
railway domain

# Run migrations
echo ""
echo "Running migrations..."
railway run python manage.py migrate

echo ""
echo "Deployment complete!"
echo ""

