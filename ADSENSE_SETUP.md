# Google AdSense Setup Guide 📢

This guide will help you integrate Google AdSense into your Trading Levels application.

---

## 📋 Prerequisites

- Your site must be deployed and publicly accessible
- You need a Google account
- Your content must comply with [AdSense policies](https://support.google.com/adsense/answer/48182)

---

## 🚀 Step-by-Step Setup

### Step 1: Sign Up for Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Click **"Get Started"**
3. Sign in with your Google account
4. Enter your website URL: `https://yourdomain.com`
5. Complete the application form

### Step 2: Add Your Site to AdSense

1. After signing up, you'll see your **Publisher ID**
   - Format: `ca-pub-XXXXXXXXXXXXXXXX`
   - **Save this!** You'll need it later

2. AdSense will ask you to verify your site ownership:
   - They'll provide a verification code
   - **Don't worry!** Our app already handles this automatically
   - Just deploy your app with the AdSense ID (next steps)

### Step 3: Configure Environment Variables

**For Local Development (.env.local):**
```bash
# Add to .env.local
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT=XXXXXXXXXX
```

**For Vercel Production:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_ADSENSE_ID` | `ca-pub-XXXXXXXXXXXXXXXX` | Production |
| `NEXT_PUBLIC_ADSENSE_SLOT` | `XXXXXXXXXX` | Production |

5. Click **Save**
6. **Redeploy** your application

---

### Step 4: Create Ad Units

1. In AdSense dashboard, go to **Ads** → **By ad unit**
2. Click **"Create new ad unit"**
3. Choose ad type:
   - **Display ads** (recommended for your app)
   - Size: Responsive (300x250 works well for sidebar)
4. Name your ad unit: e.g., "Trading Levels Sidebar"
5. Click **Create**
6. Copy the **Ad Slot ID** (looks like: `1234567890`)
7. Add it to your environment variables (see Step 3)

---

### Step 5: Deploy and Verify

```bash
# Local test
npm run dev

# Production deployment
git add .
git commit -m "Added Google AdSense integration"
git push origin main
# Vercel will auto-deploy
```

---

### Step 6: Submit Site for Review

1. Go back to AdSense dashboard
2. Click **"Submit site for review"**
3. Wait 1-2 weeks for approval
4. During this time, you'll see placeholder ads

---

## 📍 Where Ads Are Displayed

Your app shows ads in these locations:

### Desktop:
- **Sidebar** (right side, below Initial Balance cards)
- Visible on all pages with data

### Mobile:
- **Below charts** (after all trading charts)
- **Above footer** (before social share section)

---

## 🎨 Ad Placement Examples

### Current Ad Locations in Your App:

**File:** `app/page.tsx`

**Line 352:** Sidebar Ad (Desktop)
```tsx
{/* Advertisement */}
<AdPlacement />
```

**Line 362:** Mobile Ad (below charts)
```tsx
{/* Mobile Ad Section */}
<div className="lg:hidden mb-6">
  <AdPlacement />
</div>
```

---

## 🔧 Advanced: Multiple Ad Units

If you want different ads in different locations:

**Create multiple ad units in AdSense:**
1. Sidebar Ad → Get Slot ID
2. Mobile Ad → Get Slot ID
3. Footer Ad → Get Slot ID

**Update your code:**

```tsx
{/* Sidebar ad with specific slot */}
<AdPlacement slot="1234567890" format="rectangle" />

{/* Mobile ad with different slot */}
<AdPlacement slot="0987654321" format="horizontal" />
```

---

## 📊 Monitoring Your Earnings

1. Go to [AdSense Dashboard](https://www.google.com/adsense/)
2. View reports:
   - Today's earnings
   - Impressions
   - Click-through rate (CTR)
   - Revenue per thousand impressions (RPM)

---

## ⚠️ Important Notes

### Before Ads Show:

1. **Site must be approved** (1-2 weeks review)
2. **Domain must be verified**
3. **Environment variables must be set**
4. **App must be deployed** (not localhost)

### During Review:

- Ads will show as **blank** or **placeholder**
- This is normal!
- Keep your site live and publicly accessible
- Don't modify ad code during review

### After Approval:

- Ads start showing automatically
- You'll start earning!
- Check earnings daily in AdSense dashboard

---

## 🚨 Troubleshooting

### Problem: Ads not showing

**Solution:**
1. Check environment variables are set correctly:
   ```bash
   # In Vercel
   Settings → Environment Variables
   NEXT_PUBLIC_ADSENSE_ID should be visible
   ```

2. Check browser console for errors:
   - Open DevTools (F12)
   - Look for AdSense errors
   - Common: "adsbygoogle.push() error"

3. Verify AdSense account status:
   - Make sure site is approved
   - Check for policy violations

### Problem: Ads showing as blank

**Causes:**
- Site still under review (normal, wait 1-2 weeks)
- Ad blocker enabled (test in incognito)
- Insufficient traffic (AdSense needs some traffic)

**Solutions:**
- Wait for approval
- Disable ad blocker
- Drive traffic to your site

### Problem: "Ad slot not found"

**Solution:**
- Double-check `NEXT_PUBLIC_ADSENSE_SLOT` value
- Make sure you copied the full slot ID
- Redeploy after updating environment variables

---

## 💰 Expected Earnings

Typical AdSense earnings for trading/financial sites:

| Traffic | Impressions | Estimated Monthly |
|---------|-------------|-------------------|
| 100 users/day | 3,000/month | $3 - $15 |
| 500 users/day | 15,000/month | $15 - $75 |
| 1,000 users/day | 30,000/month | $30 - $150 |
| 5,000 users/day | 150,000/month | $150 - $750 |

**Note:** Finance/trading niche typically has higher CPM (cost per thousand impressions)

---

## ✅ Setup Checklist

- [ ] Signed up for Google AdSense
- [ ] Got Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
- [ ] Created ad unit and got Slot ID
- [ ] Added environment variables to Vercel
- [ ] Redeployed application
- [ ] Verified ads appear on site (blank is OK during review)
- [ ] Submitted site for review
- [ ] Waiting for approval (1-2 weeks)

---

## 📚 Additional Resources

- [AdSense Help Center](https://support.google.com/adsense/)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [Optimize Ad Performance](https://support.google.com/adsense/answer/9183460)
- [AdSense Payment Threshold](https://support.google.com/adsense/answer/1709871): $100

---

## 🔄 Testing Your Ads

### Local Testing (Development):

```bash
# Create .env.local
cp env.template .env.local

# Add your AdSense credentials
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT=XXXXXXXXXX

# Run dev server
npm run dev

# Visit http://localhost:3000
```

**Note:** Ads won't show properly on localhost. Deploy to Vercel for real testing.

### Production Testing:

1. Deploy to Vercel
2. Visit your live site
3. Open in **incognito mode** (avoid ad personalization)
4. Check if ad containers appear
5. During review: Blank ads are normal ✅
6. After approval: Real ads will show 🎉

---

## 🎯 Quick Start Summary

```bash
# 1. Get your AdSense ID from google.com/adsense
# 2. Add to Vercel environment variables:
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT=XXXXXXXXXX

# 3. Redeploy
git push origin main

# 4. Submit for review in AdSense dashboard
# 5. Wait 1-2 weeks for approval
# 6. Start earning! 💰
```

---

**Need help?** Check the troubleshooting section above or visit [AdSense Help Center](https://support.google.com/adsense/).

**Good luck with your monetization! 🚀**

