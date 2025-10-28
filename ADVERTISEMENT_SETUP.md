# Advertisement Setup Guide

## Current Placement

Your ad is strategically placed in the **right sidebar** after the Initial Balance cards. This position is:
- ✅ **SEO-friendly**: Appears after main content in DOM
- ✅ **Highly visible**: Above the fold on desktop
- ✅ **Non-intrusive**: Doesn't block primary functionality
- ✅ **Accessible**: Properly labeled with ARIA attributes

## Integration Options

### Option 1: Google AdSense (Most Popular)

**Step 1: Get AdSense Account**
1. Apply at https://www.google.com/adsense
2. Get approved (usually takes 1-2 days)
3. Get your Publisher ID (looks like `ca-pub-XXXXXXXXXXXXXXXX`)

**Step 2: Update `AdPlacement.tsx`**

```typescript
'use client';

import { useEffect } from 'react';

const AdPlacement = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <aside
      className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[250px]"
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="YYYYYYYYYY"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </aside>
  );
};

export default AdPlacement;
```

**Step 3: Add AdSense Script to Layout**

Update `app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trading Levels - Futures Contract Analysis',
  description: '...',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

### Option 2: Media.net (Yahoo! Bing Network)

**Step 1: Get Media.net Account**
1. Apply at https://www.media.net
2. Get your Site ID and Ad Unit ID

**Step 2: Update `AdPlacement.tsx`**

```typescript
'use client';

import { useEffect } from 'react';

const AdPlacement = () => {
  useEffect(() => {
    // @ts-ignore
    window._mNHandle = window._mNHandle || {};
    // @ts-ignore
    window._mNHandle.queue = window._mNHandle.queue || [];
    // @ts-ignore
    medianet_width = '300';
    // @ts-ignore
    medianet_height = '250';
    // @ts-ignore
    medianet_crid = 'YOUR_CRID_HERE';
    // @ts-ignore
    medianet_versionId = '3111299';
  }, []);

  return (
    <aside
      className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[250px]"
      aria-label="Advertisement"
    >
      <div id="YOUR_DIV_ID_HERE"></div>
    </aside>
  );
};

export default AdPlacement;
```

**Step 3: Add Media.net Script to Layout**

---

### Option 3: Carbon Ads (Developer-Focused)

Perfect for tech/trading audiences!

**Step 1: Apply at https://www.carbonads.net**

**Step 2: Update `AdPlacement.tsx`**

```typescript
'use client';

import { useEffect } from 'react';

const AdPlacement = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//cdn.carbonads.com/carbon.js?serve=YOUR_SERVE_ID&placement=YOUR_PLACEMENT';
    script.id = '_carbonads_js';
    script.async = true;
    
    const container = document.getElementById('carbon-container');
    if (container) {
      container.appendChild(script);
    }
  }, []);

  return (
    <aside
      className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[250px]"
      aria-label="Advertisement"
    >
      <div id="carbon-container"></div>
    </aside>
  );
};

export default AdPlacement;
```

---

### Option 4: Direct Ad Sales (Manual)

Sell ad space directly to brokers, trading platforms, or financial services.

**Update `AdPlacement.tsx`**

```typescript
'use client';

const AdPlacement = () => {
  return (
    <aside
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
      aria-label="Advertisement"
    >
      <a
        href="https://your-advertiser-link.com?ref=trading-levels"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block"
      >
        <img
          src="/ads/sponsor-banner.jpg"
          alt="Sponsor Name - Click to learn more"
          className="w-full h-auto"
          width={300}
          height={250}
        />
      </a>
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 text-center">
        Sponsored
      </div>
    </aside>
  );
};

export default AdPlacement;
```

**Pricing Guide for Direct Sales:**
- CPM (Cost per 1000 views): $5-$15 for finance/trading niche
- Flat monthly rate: $200-$500+ depending on traffic
- Affiliate commissions: 10-50% for trading platforms

---

### Option 5: Affiliate Marketing

Promote trading platforms and earn commissions!

**Popular Trading Affiliate Programs:**
- **Interactive Brokers**: Up to $200 per referral
- **TD Ameritrade**: $50-$100 per funded account
- **Robinhood**: Variable commissions
- **eToro**: CPA (Cost Per Acquisition) model
- **TradingView**: 50% recurring commission

**Update `AdPlacement.tsx`**

```typescript
'use client';

const AdPlacement = () => {
  return (
    <aside
      className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6"
      aria-label="Advertisement"
    >
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Trade with Confidence
        </h3>
        <p className="text-xs text-gray-600 mb-4">
          Start trading futures with zero commissions
        </p>
        <a
          href="https://www.interactivebrokers.com/en/index.php?f=7021&aff=YOUR_AFFILIATE_ID"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Open Free Account
        </a>
        <p className="text-xs text-gray-500 mt-3">
          Sponsored by Interactive Brokers
        </p>
      </div>
    </aside>
  );
};

export default AdPlacement;
```

---

## Multiple Ad Placements

Want more ad spots? Here are strategic locations:

### 1. **Banner Ad - Below Header**

Add to `app/page.tsx` after the header:

```typescript
{/* Banner Ad */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-center">
    {/* 728x90 Leaderboard Ad */}
    <div className="w-full max-w-[728px] h-[90px] flex items-center justify-center text-gray-400">
      Advertisement (728x90)
    </div>
  </div>
</div>
```

### 2. **In-Content Ad - Between Table Rows**

Add native ads within the trading table.

### 3. **Footer Ad - Below Everything**

Add before the closing footer tag.

---

## SEO Best Practices

✅ **Do:**
- Use `rel="sponsored"` for paid links
- Add ARIA labels (`aria-label="Advertisement"`)
- Place ads after main content in DOM
- Use lazy loading for off-screen ads
- Keep ad-to-content ratio under 30%

❌ **Don't:**
- Use misleading ad labels
- Block main content with ads
- Use auto-playing video ads
- Hide ads from crawlers
- Violate user experience

---

## Testing Your Ads

### Development Mode
Most ad networks don't show ads on localhost. To test:

1. **Use Test Mode** (AdSense):
   - Add `data-adtest="on"` to your ad units
   
2. **Deploy to Staging**:
   - Use Vercel/Netlify preview URLs
   - Ad networks work on live domains

3. **Use Placeholder Images**:
   - Create mockups in `/public/ads/` folder

---

## Revenue Estimates

Based on typical trading/finance website traffic:

| Traffic/Month | AdSense Revenue | Affiliate Revenue | Total Est. |
|---------------|-----------------|-------------------|------------|
| 1,000 visits  | $10-$30         | $0-$100          | $10-$130   |
| 10,000 visits | $100-$300       | $200-$1,000      | $300-$1,300|
| 100,000 visits| $1,000-$3,000   | $2,000-$10,000   | $3,000-$13,000|

*Finance/trading niches typically have 2-5x higher CPMs than general content*

---

## Compliance & Legal

### Required Disclosures:
1. **Privacy Policy** - Mention ad cookies
2. **Terms of Service** - Clarify affiliate relationships
3. **GDPR Compliance** - Cookie consent for EU users
4. **Disclaimer** - Not financial advice

### Add to Footer:

```typescript
<footer className="bg-white border-t border-gray-200 mt-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <p className="text-center text-xs text-gray-600 mb-2">
      Trading Levels Dashboard - Market data provided by Yahoo Finance
    </p>
    <p className="text-center text-xs text-gray-500">
      This site contains affiliate links. We may earn a commission from purchases made through these links.
      Not financial advice. Trading involves risk.
    </p>
    <div className="flex justify-center gap-4 mt-3 text-xs">
      <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
      <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
      <a href="/disclaimer" className="text-blue-600 hover:underline">Disclaimer</a>
    </div>
  </div>
</footer>
```

---

## Next Steps

1. **Choose Your Ad Network** (recommend starting with AdSense + affiliates)
2. **Update `components/AdPlacement.tsx`** with your ad code
3. **Add required scripts** to `app/layout.tsx`
4. **Deploy to production** (Vercel, Netlify, etc.)
5. **Wait 24-48 hours** for ads to start showing
6. **Monitor performance** in ad network dashboard

---

## Need Help?

**Common Issues:**
- Ads not showing? Check console for errors and ad blocker
- Low revenue? Try different ad placements and formats
- Policy violations? Review ad network guidelines

**Resources:**
- [Google AdSense Help](https://support.google.com/adsense)
- [Trading Affiliate Programs List](https://www.investimonials.com/affiliate-programs/)
- [Web Monetization Guide](https://developers.google.com/ad-manager)

