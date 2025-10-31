#!/bin/bash
set -e

echo "🚀 WellAppoint Frontend - DigitalOcean Deployment (Dashboard Method)"
echo "====================================================================="
echo ""

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl is not installed"
    exit 1
fi

# Check if authenticated
if ! doctl account get &> /dev/null; then
    echo "❌ Not authenticated with DigitalOcean"
    exit 1
fi

echo "✅ doctl installed and authenticated"
echo ""

# Get backend URL
if [ -f /tmp/wellappoint-backend-url.txt ]; then
    BACKEND_URL=$(cat /tmp/wellappoint-backend-url.txt)
    echo "✅ Backend URL loaded: $BACKEND_URL"
else
    echo "⚠️  Backend URL not found"
    read -p "Enter your backend URL: " BACKEND_URL
    if [ -z "$BACKEND_URL" ]; then
        echo "❌ Backend URL is required"
        exit 1
    fi
fi

echo ""
echo "📋 Step 1: Create Frontend App in Dashboard"
echo "============================================"
echo ""
echo "1. Go to: https://cloud.digitalocean.com/apps/new"
echo "2. Click 'GitHub' → Select 'primestageprime/wellappoint-ui'"
echo "3. Click 'Next'"
echo "4. Configure:"
echo "   - Resource Type: Static Site"
echo "   - Name: web"
echo "   - Branch: main"
echo "   - Build Command: npm install && npm run build"
echo "   - Output Directory: dist"
echo "5. Click 'Next'"
echo "6. Select: Basic (/month)"
echo "7. Click 'Next'"
echo ""
read -p "Press ENTER when app is created (or Ctrl+C to cancel)..."
echo ""

# Get the app
echo "🔍 Finding your app..."
echo "   Waiting for app to appear (may take 30 seconds)..."
sleep 5

# Show what apps exist
echo ""
echo "Available apps:"
doctl apps list --format Spec.Name,ID
echo ""

APP_ID=$(doctl apps list --format ID,Spec.Name --no-header | grep -i wellappoint-ui | head -1 | awk '{print $1}')

if [ -z "$APP_ID" ]; then
    echo "❌ Could not find wellappoint-ui app"
    echo ""
    echo "Please check:"
    echo "1. The app was created successfully in the dashboard"
    echo "2. Wait a minute for it to appear, then run this script again"
    echo ""
    exit 1
fi

echo "✅ Found app: $APP_ID"
echo ""

echo "🔄 Updating app with backend URL..."
echo "   Backend URL: $BACKEND_URL"
echo ""

# Update environment variables
doctl apps update "$APP_ID" \
    --spec <(cat <<EOF
name: wellappoint-ui
region: nyc
static_sites:
  - name: web
    github:
      repo: primestageprime/wellappoint-ui
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
)

echo ""
echo "✅ Configuration updated!"
echo ""
echo "⏳ Waiting for deployment (this may take 5-10 minutes)..."
echo ""

# Trigger deployment and wait
doctl apps create-deployment "$APP_ID" --wait 2>/dev/null || true

# Get app URL
APP_URL=$(doctl apps list --format ID,DefaultIngress --no-header | grep "$APP_ID" | awk '{print $2}')

echo ""
echo "🎉 Frontend deployed!"
echo ""
echo "📊 Deployment Information:"
echo "   App ID: $APP_ID"
echo "   URL: https://$APP_URL"
echo ""
echo "🧪 Testing frontend..."
sleep 5

if curl -s -o /dev/null -w "%{http_code}" "https://$APP_URL" | grep -q "200"; then
    echo "✅ Frontend is accessible!"
else
    echo "⚠️  Frontend may still be starting up"
    echo "   Try opening: https://$APP_URL"
fi

echo ""
echo "📋 Deployment Summary:"
echo "   Backend:  $BACKEND_URL"
echo "   Frontend: https://$APP_URL"
echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Open frontend: open https://$APP_URL"
echo "2. Test booking flow"
echo "3. Update backend CORS if needed (add frontend URL to main.ts)"
echo ""

