# WellAppoint Deployment Guide - Railway.app

This guide walks through deploying the WellAppoint backend and frontend to Railway.app with a custom domain.

## Cost Estimation

### Monthly Costs Breakdown

**Railway.app:**
- Backend: $5/month (512MB RAM, shared CPU)
- Frontend: $5/month (512MB RAM, shared CPU)
- **Total: $10/month**

**Domain & SSL:**
- Domain registration (wellappoint.com) = ~$12/year = $1/month
- SSL certificates = Free (Railway provides automatically)
- **Subtotal: $1/month**

**Estimated Total: $11/month**

### Resource Usage Estimates

**Backend (Deno):**
- CPU: Shared (sufficient for low traffic)
- Memory: 512MB allocated
- Storage: Minimal

**Frontend (Vite):**
- CPU: Shared (sufficient for low traffic)
- Memory: 512MB allocated
- Storage: Minimal

**Capacity:**
- ~50-100 concurrent users
- Auto-scales based on demand
- No cold starts

## Prerequisites

- Railway.app account
- GitHub account with your code repositories
- Domain control (wellappoint.com) in Square Hosting
- Google Cloud Console access for OAuth credentials

## 1. Railway.app Setup

### Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Install Railway GitHub app for your repositories

### Install Railway CLI (Optional)
```bash
# macOS
brew install railway

# Or download from: https://railway.app/cli
```

## 2. Backend Deployment

### Connect Repository
1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `wellappoint` repository
4. Railway will auto-detect it's a Deno project

### Configure Environment Variables
In the Railway dashboard, go to your backend project → Variables tab and add:

```env
# Google OAuth
GOOGLE_REFRESH_TOKEN=your-production-refresh-token
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_ADMIN_SHEET_ID=your-production-sheet-id

# Auth0 (if using)
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_AUDIENCE=https://your-backend-url.railway.app

# Other settings
NODE_ENV=production
PORT=8000
```

### Deploy Backend
1. Railway will automatically detect the Deno project
2. It will run `deno task start` to start the server
3. The backend will be available at: `https://your-project-name.railway.app`
4. Note this URL for the frontend configuration

## 3. Frontend Deployment

### Connect Repository
1. Create another "New Project" in Railway
2. Select "Deploy from GitHub repo"
3. Choose your `wellappoint-ui` repository
4. Railway will auto-detect it's a Vite project

### Configure Environment Variables
In the Railway dashboard, go to your frontend project → Variables tab and add:

```env
# API Configuration
VITE_API_BASE_URL=https://your-backend-url.railway.app
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://your-backend-url.railway.app

# Other settings
NODE_ENV=production
```

### Deploy Frontend
1. Railway will automatically detect the Vite project
2. It will run `npm run build` to build the project
3. It will serve the built files from the `dist` directory
4. The frontend will be available at: `https://your-frontend-project-name.railway.app`

## 4. Custom Domain Setup

### Add Custom Domain in Railway
1. Go to your frontend project → Settings → Domains
2. Click "Add Domain"
3. Enter `wellappoint.com`
4. Railway will provide DNS records to configure

### Configure DNS in Square Hosting
In your Square Hosting DNS settings, add these records:

```
Type: CNAME
Name: @ (or leave blank for root domain)
Value: cname.railway.app
TTL: 300

Type: CNAME
Name: www
Value: cname.railway.app
TTL: 300

Type: CNAME
Name: api
Value: your-backend-url.railway.app
TTL: 300
```

### SSL Certificate
Railway automatically provisions SSL certificates via Let's Encrypt. No additional configuration needed.

## 5. Environment Variables Management

### Production Environment File
Create `wellappoint/.env.production` for local reference:
```env
# Google OAuth
GOOGLE_REFRESH_TOKEN=your-production-refresh-token
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_ADMIN_SHEET_ID=your-production-sheet-id

# Auth0 (if using)
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_AUDIENCE=https://your-backend-url.railway.app

# Other production settings
NODE_ENV=production
PORT=8000
```

### Frontend Environment File
Create `wellappoint-ui/.env.production` for local reference:
```env
VITE_API_BASE_URL=https://your-backend-url.railway.app
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://your-backend-url.railway.app
```

## 6. Monitoring and Logs

### View Logs
```bash
# Using Railway CLI
railway login
railway link
railway logs

# Or view in Railway dashboard
# Go to your project → Deployments → Click on deployment → Logs
```

### Check Deployment Status
- Go to Railway dashboard → Your project → Deployments
- Each deployment shows status, logs, and metrics
- Railway automatically redeploys on GitHub pushes

## 7. Scaling and Updates

### Automatic Scaling
Railway automatically scales based on traffic. No manual configuration needed.

### Manual Scaling (if needed)
1. Go to your project → Settings → Resources
2. Adjust CPU and memory allocation
3. Railway will handle the scaling

### Updates
Railway automatically deploys when you push to your GitHub repository:
```bash
git add .
git commit -m "Update application"
git push origin main
# Railway automatically deploys the changes
```

## 8. Backup and Recovery

### Environment Variables Backup
1. Go to your project → Variables
2. Export variables as needed
3. Keep a local copy of your `.env.production` files

### Database Backup (if using)
Railway provides automatic backups for databases. Configure in your database project settings.

## 9. Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Railway logs for build errors
   - Ensure all dependencies are in `package.json` or `deno.json`
   - Verify environment variables are set correctly

2. **Environment Variables**
   - Ensure all required variables are set in Railway dashboard
   - Check for typos in variable names
   - Verify values are correct

3. **Domain Issues**
   - Check DNS propagation (can take up to 48 hours)
   - Verify CNAME records are correct
   - Check Railway domain settings

4. **Performance Issues**
   - Monitor Railway metrics in dashboard
   - Check if scaling is needed
   - Review application logs for bottlenecks

### Debugging Commands
```bash
# Check Railway status
railway status

# View recent logs
railway logs

# Connect to project
railway link

# Open project in browser
railway open
```

## 10. Security Considerations

- Environment variables are encrypted in Railway
- SSL certificates are automatically managed
- Railway provides DDoS protection
- Regular security updates are applied automatically

## 11. Cost Optimization

- Railway charges based on actual usage
- Free tier available for development/testing
- Automatic scaling prevents over-provisioning
- Monitor usage in Railway dashboard

## 12. Migration Path

If you need to scale beyond Railway's capabilities:

1. **Railway → DigitalOcean App Platform**: Similar simplicity, more resources
2. **Railway → DigitalOcean Kubernetes**: Full control, more complex
3. **Railway → AWS/GCP**: Enterprise features, higher cost

## Quick Start Checklist

- [ ] Create Railway account
- [ ] Connect backend repository
- [ ] Set backend environment variables
- [ ] Deploy backend
- [ ] Connect frontend repository
- [ ] Set frontend environment variables
- [ ] Deploy frontend
- [ ] Add custom domain
- [ ] Configure DNS
- [ ] Test application
- [ ] Monitor logs and performance

## Support

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app
