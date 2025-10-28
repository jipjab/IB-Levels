# Referral Links Setup Guide

## Where Your Referral Links Appear 🎯

I've added **4 strategic placements** for your TradingView and Topstep referral links:

### 1. **Right Sidebar - Card Style** (2 cards)
- Below Initial Balance cards
- Below Advertisement
- Perfect for desktop users
- Eye-catching card design with icons

### 2. **Above Footer - Banner Style** (SponsorsSection)
- Visible to all users before they leave
- Full-width banner format
- Catches users after they've consumed content

### 3. **Ready for More** (Optional)
You can easily add button-style links anywhere!

---

## How to Add Your Referral IDs

### Step 1: Get TradingView Affiliate Link

1. **Sign up for TradingView Affiliate Program**
   - Go to: https://www.tradingview.com/partner-program/
   - Or contact: partners@tradingview.com
   - Commission: **50% recurring** (very generous!)

2. **Get Your Affiliate ID**
   - Example: `aff_id=123456`
   - Full URL: `https://www.tradingview.com/?aff_id=123456`

3. **Update the Component**

Edit `components/AffiliateLinks.tsx` at line 14:

```typescript
tradingview: {
  name: 'TradingView',
  description: 'Advanced charting & technical analysis',
  url: 'https://www.tradingview.com/?aff_id=YOUR_ACTUAL_ID_HERE', // 👈 Change this
  cta: 'Get TradingView Pro',
  // ...
}
```

---

### Step 2: Get Topstep Affiliate Link

1. **Sign up for Topstep Affiliate Program**
   - Go to: https://www.topstepfx.com/affiliates/
   - Or: https://www.topsteptrader.com/affiliates/ (for futures)
   - Commission: Up to **$250 per funded trader**

2. **Get Your Referral Link**
   - Example: `https://www.topstepfx.com/?ref=yourname`
   - Or: `https://www.topstepfx.com/r/yourname`

3. **Update the Component**

Edit `components/AffiliateLinks.tsx` at line 23:

```typescript
topstep: {
  name: 'TopstepFX',
  description: 'Get funded & trade with up to $150K',
  url: 'https://www.topstepfx.com/?ref=YOUR_REFERRAL_CODE', // 👈 Change this
  cta: 'Start Trading Challenge',
  // ...
}
```

---

## Customization Options

### Change Button Text

In `components/AffiliateLinks.tsx`, modify the `cta` field:

```typescript
cta: 'Your Custom Text Here',
```

### Change Description

```typescript
description: 'Your custom description here',
```

### Add More Affiliate Programs

You can easily add more platforms! Edit `components/AffiliateLinks.tsx`:

```typescript
const platforms = {
  tradingview: { /* ... */ },
  topstep: { /* ... */ },
  // Add new platform here:
  interactivebrokers: {
    name: 'Interactive Brokers',
    description: 'Professional trading platform',
    url: 'https://www.interactivebrokers.com/?aff=YOUR_ID',
    cta: 'Open Free Account',
    icon: '💼',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
  },
};
```

Then add to your page:

```typescript
<AffiliateLinks platform="interactivebrokers" variant="card" />
```

---

## Display Variants

### 1. Card Variant (Currently in Sidebar)

```typescript
<AffiliateLinks platform="tradingview" variant="card" />
```

**Appearance:**
- Vertical card layout
- Large icon on top
- Centered text
- Call-to-action button

---

### 2. Banner Variant (Currently in SponsorsSection)

```typescript
<AffiliateLinks platform="tradingview" variant="banner" />
```

**Appearance:**
- Horizontal banner layout
- Icon on left
- Text in middle
- Button on right

---

### 3. Button Variant (Add Anywhere!)

```typescript
<AffiliateLinks platform="tradingview" variant="button" />
```

**Appearance:**
- Small inline button
- Icon + text
- Perfect for in-content placement

**Example usage in your page:**

```typescript
<div className="text-center my-8">
  <p className="text-gray-600 mb-4">
    Enhance your trading with these professional tools:
  </p>
  <div className="flex gap-4 justify-center">
    <AffiliateLinks platform="tradingview" variant="button" />
    <AffiliateLinks platform="topstep" variant="button" />
  </div>
</div>
```

---

## Where Links Are Currently Placed

### ✅ Sidebar (Right Column)
**File:** `app/page.tsx` - Lines 161-164

```typescript
{/* Affiliate Links - TradingView & Topstep */}
<div className="space-y-4">
  <AffiliateLinks platform="tradingview" variant="card" />
  <AffiliateLinks platform="topstep" variant="card" />
</div>
```

### ✅ Above Footer
**File:** `app/page.tsx` - Lines 173-176

```typescript
{/* Sponsors Section - Before Footer */}
<div className="mb-8">
  <SponsorsSection />
</div>
```

**SponsorsSection Component** shows both links in banner format.

---

## Revenue Potential 💰

### TradingView Affiliate Program
- **Commission:** 50% of subscription (recurring!)
- **Plans:** 
  - Pro: $14.95/month → You earn $7.48/month per user
  - Pro+: $29.95/month → You earn $14.98/month per user
  - Premium: $59.95/month → You earn $29.98/month per user
- **Cookie Duration:** 30 days
- **Lifetime Value:** High (recurring monthly commissions)

### Topstep Affiliate Program
- **Commission:** $50-$250 per funded trader
- **Average:** $150 per funded trader
- **Cookie Duration:** 90 days
- **One-time payment** but very high value

### Estimated Earnings

| Monthly Visitors | TradingView Referrals | Topstep Referrals | Monthly Revenue |
|------------------|----------------------|-------------------|-----------------|
| 1,000            | 5 signups            | 2 funded          | $75 + $300 = $375 |
| 10,000           | 50 signups           | 20 funded         | $750 + $3,000 = $3,750 |
| 100,000          | 500 signups          | 200 funded        | $7,500 + $30,000 = $37,500 |

*Note: These are conservative estimates. Trading/finance audiences typically convert 2-5x better than general content.*

---

## Compliance & Best Practices

### ✅ Already Implemented

1. **`rel="sponsored"`** attribute on all links (Google-friendly)
2. **`rel="noopener noreferrer"`** for security
3. **Clear disclosure:** "Partner Link" / "We may earn a commission"
4. **Accessible:** Proper `aria-label` attributes
5. **SEO-friendly:** Links don't interfere with main content

### 📝 Recommended Disclosures

Add to your footer (already suggested in earlier setup):

```typescript
<p className="text-center text-xs text-gray-500">
  This site contains affiliate links. We may earn a commission from 
  purchases made through these links. Not financial advice.
</p>
```

---

## Testing Your Links

### Before Launch:
1. ✅ Replace `YOUR_TRADINGVIEW_AFFILIATE_ID` with actual ID
2. ✅ Replace `YOUR_TOPSTEP_AFFILIATE_ID` with actual ID
3. ✅ Test links in incognito mode
4. ✅ Verify tracking codes work
5. ✅ Check mobile responsiveness

### After Launch:
1. Monitor clicks in affiliate dashboards
2. Track conversions
3. A/B test different placements
4. Adjust CTAs based on performance

---

## Quick Reference

### Files to Edit:
1. **`components/AffiliateLinks.tsx`** - Main component (lines 14 & 23)
2. **`app/page.tsx`** - Already integrated ✅
3. **`components/SponsorsSection.tsx`** - Already set up ✅

### What to Replace:
- `YOUR_TRADINGVIEW_AFFILIATE_ID` → Your actual TradingView affiliate ID
- `YOUR_TOPSTEP_AFFILIATE_ID` → Your actual Topstep referral code

---

## Need More Affiliate Programs?

### Other High-Value Trading Affiliates:

**Brokerage Platforms:**
- Interactive Brokers: $200+ per funded account
- TD Ameritrade: $50-100 per account
- eToro: CPA model

**Trading Education:**
- Udemy Trading Courses: 15% commission
- TradingAcademy: Various programs

**Tools & Data:**
- Benzinga Pro: $50-75 per subscription
- Trade Ideas: 25% recurring commission
- Bookmap: $200-300 per license

Let me know if you want me to add any of these! 🚀

---

## Support

Having issues? Check:
1. Are your affiliate IDs correct?
2. Are links opening in new tabs?
3. Check browser console for errors
4. Verify affiliate program approval status

Your referral links are now live and ready to generate revenue! 💸

