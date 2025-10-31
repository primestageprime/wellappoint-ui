#!/bin/bash
set -e

echo "🚀 WellAppoint Frontend - DigitalOcean Deployment"
echo "=================================================="
echo ""

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl is not installed"
    echo ""
    echo "Install with: brew install doctl"
    echo "Or visit: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if authenticated
if ! doctl account get &> /dev/null; then
    echo "❌ Not authenticated with DigitalOcean"
    echo ""
    echo "Run: doctl auth init"
    exit 1
fi

echo "✅ doctl installed and authenticated"
echo ""

# Get backend URL
if [ -f /tmp/wellappoint-backend-url.txt ]; then
    BACKEND_URL=$(cat /tmp/wellappoint-backend-url.txt)
    echo "✅ Backend URL loaded: $BACKEND_URL"
else
    echo "⚠️  Backend URL not found in /tmp/wellappoint-backend-url.txt"
    echo ""
    read -p "Enter your backend URL: " BACKEND_URL
    if [ -z "$BACKEND_URL" ]; then
        echo "❌ Backend URL is required"
        exit 1
    fi
fi

echo ""

# Push code to GitHub
echo "📤 Ensuring code is pushed to GitHub..."
git add .
git diff --quiet && git diff --staged --quiet || git commit -m "Deploy frontend to DigitalOcean"
git push origin main
echo "✅ Code pushed to GitHub"
echo ""

# Get GitHub username from git remote
GITHUB_REPO=$(git remote get-url origin | sed -E 's/.*[:/]([^/]+)\/([^/.]+)(\.git)?$/\1\/\2/')
echo "📦 GitHub repository: $GITHUB_REPO"
echo ""

# Create app spec
echo "📝 Creating app specification..."
cat > /tmp/wellappoint-frontend-spec.yaml <<EOF
name: wellappoint-ui
region: nyc
static_sites:
  - name: web
    github:
      repo: $GITHUB_REPO
      branch: main
      deploy_on_push: true
    build_command: npm install && npm run build
    output_dir: dist
    environment_slug: node-js
    envs:
      - key: NODE_ENV
        value: production
      - key: VITE_API_BASE_URL
        value: $BACKEND_URL
EOF

echo "✅ App specification created"
echo ""

# Deploy app
echo "🚀 Creating app on DigitalOcean..."
echo "   This may take 5-10 minutes..."
echo ""

doctl apps create --spec /tmp/wellappoint-frontend-spec.yaml --wait

# Get app info
APP_ID=$(doctl apps list --format ID,Spec.Name | grep wellappoint-ui | awk '{print $1}')
APP_URL=$(doctl apps list --format ID,DefaultIngress | grep "$APP_ID" | awk '{print $2}')

echo ""
echo "✅ Frontend deployed successfully!"
echo ""
echo "📊 Deployment Information:"
echo "   App ID: $APP_ID"
echo "   URL: https://$APP_URL"
echo ""
echo "🧪 Testing frontend..."
sleep 10  # Wait for app to be fully ready

if curl -s -o /dev/null -w "%{http_code}" "https://$APP_URL" | grep -q "200"; then
    echo "✅ Frontend is accessible!"
else
    echo "⚠️  Frontend may still be starting up"
    echo "   Check logs with: doctl apps logs $APP_ID --follow"
fi

echo ""
echo "🎉 Frontend deployment complete!"
echo ""
echo "📋 Deployment Summary:"
echo "   Backend:  $BACKEND_URL"
echo "   Frontend: https://$APP_URL"
echo ""
echo "🔧 Next steps:"
echo "   1. Open frontend: open https://$APP_URL"
echo "   2. Test booking flow"
echo "   3. View logs: doctl apps logs $APP_ID --follow"
echo ""
echo "💡 Optional: Add custom domain"
echo "   doctl apps update $APP_ID --spec .do/app.yaml"
echo ""

# Cleanup
rm /tmp/wellappoint-frontend-spec.yaml

# Update backend CORS if needed
echo "⚠️  IMPORTANT: Update backend CORS"
echo ""
echo "Add this URL to backend CORS in src/main.ts:"
echo "   \"https://$APP_URL\","
echo ""
echo "Then commit and push to trigger auto-deployment:"
echo "   cd ../wellappoint"
echo "   git add src/main.ts"
echo "   git commit -m \"Add production frontend URL to CORS\""
echo "   git push origin main"
echo ""

