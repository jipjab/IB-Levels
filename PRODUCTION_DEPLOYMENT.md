# Production Deployment Guide

This guide covers deploying IBLevels to production with best practices for security, performance, and reliability.

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [x] TypeScript/ESLint errors fixed
- [x] Rate limiting implemented
- [x] Caching strategy in place
- [x] Security headers configured
- [x] Error handling improved
- [x] Production logging implemented

### ⚙️ Configuration
- [ ] Environment variables set up
- [ ] Twelve Data API key obtained
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate ready

### 🧪 Testing
- [ ] Test locally with production build
- [ ] Test API endpoints
- [ ] Test on different devices/browsers
- [ ] Test with real Twelve Data API

---

## 🔐 Environment Variables

Create a `.env.production` file (or configure in your hosting platform):

```bash
# Required
TWELVE_DATA_API_KEY=your_actual_api_key_here
NODE_ENV=production

# Recommended
NEXT_PUBLIC_APP_URL=https://yourdomain.com
API_RATE_LIMIT=60
CACHE_DURATION=300

# Optional - Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Get Twelve Data API Key
1. Go to https://twelvedata.com/
2. Sign up for free account (800 API calls/day)
3. Get your API key from dashboard
4. Add to environment variables

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel:**
- Built for Next.js (zero configuration)
- Automatic SSL certificates
- Global CDN
- Generous free tier
- Built-in analytics

**Steps:**
1. Push code to GitHub/GitLab
2. Visit https://vercel.com
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `TWELVE_DATA_API_KEY`
   - `NODE_ENV=production`
   - `API_RATE_LIMIT=60`
   - `CACHE_DURATION=300`
5. Deploy!

**CLI Method:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

### Option 2: Netlify

**Steps:**
1. Push code to GitHub
2. Visit https://netlify.com
3. Connect repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables
6. Deploy

---

### Option 3: DigitalOcean App Platform

**Steps:**
1. Create DigitalOcean account
2. Go to App Platform
3. Connect GitHub repository
4. Configure:
   - Type: Web Service
   - Build command: `npm run build`
   - Run command: `npm start`
   - Port: 3000
5. Add environment variables
6. Deploy

**Cost:** ~$5-12/month

---

### Option 4: Railway

**Steps:**
1. Visit https://railway.app
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically

**Cost:** Free tier available, then usage-based

---

### Option 5: AWS Amplify

**Steps:**
1. Visit AWS Amplify Console
2. Connect repository
3. Build settings:
   - Framework: Next.js - SSR
   - Build command: `npm run build`
   - Start command: `npm start`
4. Add environment variables
5. Deploy

---

### Option 6: Self-Hosted VPS (Advanced)

**Requirements:**
- Ubuntu 20.04+ server
- Node.js 18+
- Nginx
- PM2 for process management
- SSL certificate (Let's Encrypt)

**Steps:**

1. **Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

2. **Deploy Application:**
```bash
# Clone repository
git clone https://github.com/yourusername/Trading_Levels.git
cd Trading_Levels

# Install dependencies
npm install

# Create .env.production
nano .env.production
# Add your environment variables

# Build application
npm run build

# Start with PM2
pm2 start npm --name "iblevels" -- start
pm2 save
pm2 startup
```

3. **Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/iblevels
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/iblevels /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Setup SSL:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🧪 Testing Production Build Locally

Before deploying, test the production build:

```bash
# Create .env.production with your variables
cp env.template .env.production

# Build for production
npm run build

# Start production server
npm start

# Test at http://localhost:3000
```

**Test Checklist:**
- [ ] Home page loads correctly
- [ ] Can select instruments
- [ ] Can fetch trading data
- [ ] Charts display properly
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Rate limiting works (test 60+ requests)
- [ ] Caching works (check response headers)

---

## 📊 Monitoring & Performance

### Rate Limiting
- Default: 60 requests per minute per IP
- Adjust via `API_RATE_LIMIT` env variable
- Responses include rate limit headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### Caching
- Default: 5 minutes (300 seconds)
- Adjust via `CACHE_DURATION` env variable
- Reduces API calls to Twelve Data
- Responses include `cached: true/false` field

### Security Headers
Automatically added to all responses:
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Referrer-Policy`
- `Permissions-Policy`

---

## 🔍 Monitoring Recommendations

### Free Options:
1. **Vercel Analytics** (if using Vercel)
2. **Google Analytics** - Add to env: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
3. **Uptime Robot** - Free uptime monitoring
4. **LogRocket** - Free tier for session replay

### Paid Options:
1. **Sentry** - Error tracking ($26/month)
2. **Datadog** - Full observability
3. **New Relic** - Application monitoring

---

## 🚨 Troubleshooting

### Issue: API calls failing in production
**Solution:**
- Verify `TWELVE_DATA_API_KEY` is set correctly
- Check API usage limits (800/day free tier)
- Check server logs for error messages

### Issue: Rate limiting too strict
**Solution:**
- Increase `API_RATE_LIMIT` environment variable
- Default is 60 requests/minute

### Issue: Slow response times
**Solution:**
- Increase `CACHE_DURATION` (default: 300s)
- Consider upgrading Twelve Data plan
- Check server resources

### Issue: Build fails
**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## 📱 Post-Deployment

### 1. Test Production Deployment
- [ ] Visit your domain
- [ ] Test all features
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate

### 2. Setup Monitoring
- [ ] Add Google Analytics (optional)
- [ ] Setup uptime monitoring
- [ ] Configure error tracking

### 3. Documentation
- [ ] Update README with production URL
- [ ] Document any custom configurations
- [ ] Keep API key secure (never commit to Git)

### 4. Performance Optimization
- [ ] Enable CDN (automatic with Vercel/Netlify)
- [ ] Monitor API usage
- [ ] Adjust cache duration if needed

---

## 💰 Cost Estimates

### Hosting
- **Vercel/Netlify:** Free (then $20/month)
- **Railway:** Free tier, then ~$5/month
- **DigitalOcean:** $5-12/month
- **AWS Amplify:** ~$15-30/month
- **Self-hosted VPS:** $5-10/month

### API (Twelve Data)
- **Free:** 800 calls/day (good for testing)
- **Basic:** $8/month - 8,000 calls/day
- **Pro:** $50/month - Unlimited

### Total Estimated Cost
- **Minimum:** $0/month (Vercel free + Twelve Data free)
- **Recommended:** $20-30/month (Paid hosting + Basic API)

---

## 🔄 Continuous Deployment

### GitHub Actions (Automatic Deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📞 Support

For deployment issues:
1. Check this documentation
2. Review platform-specific docs
3. Check application logs
4. Verify environment variables
5. Test locally with production build

---

## ✅ Production Checklist Summary

- [ ] Code tested locally with production build
- [ ] Environment variables configured
- [ ] Twelve Data API key obtained
- [ ] Hosting platform selected
- [ ] Application deployed
- [ ] SSL certificate active
- [ ] Domain configured (if applicable)
- [ ] Monitoring setup
- [ ] Performance tested
- [ ] Mobile tested
- [ ] Documentation updated

**You're ready for production! 🎉**

