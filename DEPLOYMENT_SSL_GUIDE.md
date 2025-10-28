# Deployment & SSL Setup Guide

## 🚀 Hosting Options with Free SSL

Your IBLevels site can be deployed to several platforms that provide **automatic SSL certificates** (Let's Encrypt) for free!

---

## Option 1: Vercel (Recommended - Easiest) ⭐

**Why Vercel:**
- ✅ **Free SSL** - Automatic Let's Encrypt certificates
- ✅ **Zero configuration** - Works out of the box
- ✅ **Made for Next.js** - Optimal performance
- ✅ **Free hobby plan** - Perfect for starting
- ✅ **Global CDN** - Fast worldwide
- ✅ **Auto deployments** - Push to GitHub, auto deploy

### Setup Steps:

#### 1. Push to GitHub

```bash
cd /Users/jp.mutuyimana/Documents/Dev/Trading_Levels
git init
git add .
git commit -m "Initial commit - IBLevels"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/iblevels.git
git push -u origin main
```

#### 2. Deploy to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your `iblevels` repository
5. Click "Deploy"

**That's it!** Your site will be live at `https://your-project.vercel.app`

#### 3. Add Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel dashboard → Settings → Domains
3. Add your domain: `iblevels.com`
4. Update DNS records (Vercel shows exact records)
5. **SSL is automatic!** Vercel handles everything

**Your site will be at:** `https://iblevels.com` with full SSL ✅

---

## Option 2: Netlify (Also Great)

**Why Netlify:**
- ✅ **Free SSL** - Automatic Let's Encrypt
- ✅ **Simple setup** - Drag & drop or Git
- ✅ **Free tier** - Generous limits
- ✅ **CDN included** - Fast globally

### Setup Steps:

#### 1. Build Your App

```bash
cd /Users/jp.mutuyimana/Documents/Dev/Trading_Levels
npm run build
```

#### 2. Deploy to Netlify

**Option A: Drag & Drop**
1. Go to https://netlify.com
2. Sign up
3. Drag your `.next` folder to Netlify
4. Done!

**Option B: GitHub Integration**
1. Push to GitHub (same as Vercel)
2. Connect Netlify to GitHub repo
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Deploy!

#### 3. Custom Domain + SSL

1. Netlify Dashboard → Domain Settings
2. Add custom domain
3. Update DNS records
4. **SSL auto-enabled!** (Let's Encrypt)

**Live at:** `https://iblevels.com` ✅

---

## Option 3: Self-Hosted VPS (Full Control)

If you want to host on your own server (DigitalOcean, AWS, Linode, etc.):

### Server Setup:

#### 1. Get a VPS
- DigitalOcean Droplet ($5/month)
- AWS Lightsail ($3.50/month)
- Linode ($5/month)

#### 2. Install Requirements

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Nginx
apt install -y nginx

# Install Certbot (Let's Encrypt)
apt install -y certbot python3-certbot-nginx
```

#### 3. Upload Your App

```bash
# On your local machine
cd /Users/jp.mutuyimana/Documents/Dev/Trading_Levels
npm run build

# Upload to server (replace with your server IP)
rsync -avz --exclude 'node_modules' . root@your-server-ip:/var/www/iblevels/
```

#### 4. Install Dependencies on Server

```bash
# On server
cd /var/www/iblevels
npm install --production
```

#### 5. Setup PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start your app
cd /var/www/iblevels
pm2 start npm --name "iblevels" -- start

# Make PM2 start on boot
pm2 startup
pm2 save
```

#### 6. Configure Nginx

```bash
# Create Nginx config
nano /etc/nginx/sites-available/iblevels
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name iblevels.com www.iblevels.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable the site:**

```bash
# Create symlink
ln -s /etc/nginx/sites-available/iblevels /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx
```

#### 7. Setup SSL with Let's Encrypt 🔒

**This is the important part!**

```bash
# Get SSL certificate (replace with your domain)
certbot --nginx -d iblevels.com -d www.iblevels.com

# Follow prompts:
# - Enter your email
# - Agree to Terms
# - Choose redirect HTTP to HTTPS (option 2)
```

**Certbot will:**
- ✅ Get SSL certificate from Let's Encrypt
- ✅ Configure Nginx automatically
- ✅ Setup auto-renewal (every 90 days)

**Verify auto-renewal:**

```bash
# Test renewal
certbot renew --dry-run

# Check renewal timer
systemctl status certbot.timer
```

**Your site is now live at:** `https://iblevels.com` with SSL! ✅

#### 8. Firewall Setup

```bash
# Allow Nginx
ufw allow 'Nginx Full'

# Allow SSH
ufw allow OpenSSH

# Enable firewall
ufw enable
```

---

## Option 4: Docker + Let's Encrypt

If you prefer Docker:

### Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  iblevels:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - iblevels

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

### Get SSL Certificate:

```bash
# First run to get certificate
docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot -d iblevels.com -d www.iblevels.com

# Start all services
docker-compose up -d
```

---

## DNS Configuration

For **any hosting option with custom domain**, you need to configure DNS:

### A Records (Point to your server):

```
Type    Name    Value           TTL
A       @       YOUR_SERVER_IP  3600
A       www     YOUR_SERVER_IP  3600
```

### For Vercel/Netlify (Use CNAME):

```
Type    Name    Value                       TTL
CNAME   @       cname.vercel-dns.com       3600
CNAME   www     cname.vercel-dns.com       3600
```

*(Vercel/Netlify will provide exact records)*

---

## SSL Certificate Monitoring

### Check SSL Status:

```bash
# Check certificate expiry
echo | openssl s_client -servername iblevels.com -connect iblevels.com:443 2>/dev/null | openssl x509 -noout -dates

# Test SSL configuration
curl -I https://iblevels.com
```

### SSL Testing Tools:
- https://www.ssllabs.com/ssltest/ - Grade your SSL config
- https://www.sslshopper.com/ssl-checker.html - Quick check

---

## Environment Variables

If you add API keys later, use environment variables:

### Vercel/Netlify:
Add in dashboard → Settings → Environment Variables

### VPS:
Create `.env.local`:

```bash
# On server
cd /var/www/iblevels
nano .env.local
```

Add your variables:
```
TRADINGVIEW_API_KEY=your_key
TOPSTEP_API_KEY=your_key
```

Restart:
```bash
pm2 restart iblevels
```

---

## Performance Optimization

### 1. Enable Caching

**Nginx caching** (for VPS):

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

location /_next/static {
    proxy_cache STATIC;
    proxy_pass http://localhost:3000;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### 2. Enable Gzip

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
```

### 3. HTTP/2

Nginx with SSL automatically enables HTTP/2 ✅

---

## Security Headers

Add to Nginx config:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

---

## Monitoring & Maintenance

### Server Monitoring (VPS):

```bash
# Install monitoring tools
apt install -y htop iotop

# Monitor logs
pm2 logs iblevels

# Monitor Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Check SSL renewal
journalctl -u certbot.timer
```

### Uptime Monitoring:
- https://uptimerobot.com (Free)
- https://healthchecks.io (Free tier)

---

## Backup Strategy

### Automated Backups (VPS):

```bash
# Create backup script
nano /root/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Backup app
tar -czf $BACKUP_DIR/iblevels_$DATE.tar.gz /var/www/iblevels

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# Make executable
chmod +x /root/backup.sh

# Schedule daily (crontab)
crontab -e

# Add line:
0 2 * * * /root/backup.sh
```

---

## Quick Reference Commands

### Vercel:
```bash
npm install -g vercel
vercel login
vercel --prod
```

### VPS Management:
```bash
# Restart app
pm2 restart iblevels

# Restart Nginx
systemctl restart nginx

# Renew SSL manually
certbot renew

# View logs
pm2 logs
journalctl -u nginx
```

---

## Troubleshooting

### SSL Not Working?

```bash
# Check Nginx config
nginx -t

# Check certificate files
ls -la /etc/letsencrypt/live/iblevels.com/

# Test renewal
certbot renew --dry-run
```

### App Not Starting?

```bash
# Check PM2 status
pm2 status

# View errors
pm2 logs iblevels --err

# Restart
pm2 restart iblevels
```

---

## Recommended Setup

**For beginners:** Vercel (automatic SSL, zero config)  
**For control:** Self-hosted VPS with Let's Encrypt  
**For scale:** Both + CDN (Cloudflare)

Your IBLevels site will be secure with HTTPS! 🔒✅

