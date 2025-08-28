#!/bin/bash

# Envaran Matrimony - GitHub Setup Script
# This script helps you set up the repository for GitHub deployment

echo "🚀 Setting up Envaran Matrimony for GitHub deployment..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your actual values."
    echo "⚠️  IMPORTANT: Update the .env file with your Firebase and database credentials before proceeding."
    read -p "Press Enter after you've updated the .env file..."
fi

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
fi

# Add all files to git
echo "📦 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Envaran Matrimony - Second Chance Matrimony Platform"

# Ask for GitHub repository URL
echo ""
echo "🌐 GitHub Repository Setup"
echo "=========================="
echo "Please create a new repository on GitHub and provide the URL below."
echo "Example: https://github.com/yourusername/SecondChanceMatrimony.git"
echo ""

read -p "Enter your GitHub repository URL: " github_url

if [ -z "$github_url" ]; then
    echo "❌ No repository URL provided. Exiting..."
    exit 1
fi

# Add remote origin
echo "🔗 Adding GitHub remote..."
git remote add origin "$github_url"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up environment variables in your deployment platform"
echo "2. Configure your database and Firebase project"
echo "3. Deploy your application"
echo ""
echo "🔐 Security Reminders:"
echo "- Never commit .env files to Git"
echo "- Keep your Firebase keys secure"
echo "- Use strong passwords for admin accounts"
echo ""
echo "📚 Documentation:"
echo "- Check README.md for detailed setup instructions"
echo "- Review env.example for required environment variables"
echo ""
echo "🎉 Your Envaran Matrimony project is now ready for deployment!"
