# API Call Optimization Strategy

## Overview

This application uses **smart caching** to minimize API calls to Twelve Data, respecting rate limits while keeping data fresh.

## How It Works

### 1. **Intelligent Caching**
- Data is cached in `localStorage` for **30 minutes**
- Cache is automatically invalidated when a trading session closes
- Users see cached data instantly on page load

### 2. **Session-Aware Refresh**
The app only fetches new data when:
- ✅ User clicks **"Apply"** button (manual refresh)
- ✅ A trading session has **closed** since last fetch
- ✅ Cache is **expired** (> 30 minutes old)
- ✅ **No cached data** exists

### 3. **Trading Session Boundaries**

| Session | Open (ET) | Close (ET) | Auto-Refresh Time |
|---------|-----------|------------|-------------------|
| **Asia** | 6:00 PM | 3:00 AM | At 3:00 AM |
| **London** | 3:00 AM | 12:00 PM | At 12:00 PM |
| **New York** | 9:30 AM | 4:00 PM | At 4:00 PM |

## API Call Frequency

### Without Optimization (Old Behavior)
- **Every filter change** = 1 API call
- **Every instrument toggle** = 1 API call
- **Every session switch** = 1 API call
- **Estimated**: 20-50 API calls/day per user

### With Optimization (New Behavior)
- **Manual refresh** = 1 API call
- **Session close** = 1 API call (automatic)
- **Cache expired** = 1 API call
- **Estimated**: 3-10 API calls/day per user

**Savings**: 70-80% reduction in API calls! 🎉

## User Experience

### Data Status Bar
Shows real-time information:
```
Last updated: 10:45:23 AM • 5m ago | Next NewYork boundary: 5h 15m
```

### Console Logs (F12)
Users can see what's happening:
```
📦 Loading cached data (age: 5m)
⚡ Using cached data (age: 5m)
💡 Tip: Data auto-refreshes when session closes or you click Apply
🚀 Fetching fresh trading data: { reason: 'Manual refresh' }
💾 Data cached for quick access
```

## Technical Implementation

### Key Files
- **`lib/sessionBoundaries.ts`** - Session time calculations
- **`app/page.tsx`** - Caching logic and fetch control
- **`localStorage`** - Client-side cache storage

### Cache Structure
```typescript
{
  data: TradingLevel[];      // Actual trading data
  timestamp: number;          // When data was fetched
  instruments: string[];      // Which instruments
  startDate: string;          // Date range start
  endDate: string;            // Date range end
  session: string;            // Trading session
}
```

### Cache Validation
```typescript
// Cache is valid if:
1. Age < 30 minutes AND
2. No session close since last fetch
```

## For Twelve Data API

### Free Tier (800 calls/day)
- **Without optimization**: ~50 calls/day/user → 16 users max
- **With optimization**: ~8 calls/day/user → 100 users max

### Basic Plan (Higher limits)
- Can support hundreds of concurrent users
- Auto-refresh at session boundaries ensures data freshness
- Manual refresh always available for latest data

## Best Practices

### For Users
1. **Let the cache work** - Don't spam the Apply button
2. **Check status bar** - See when data was last updated
3. **Manual refresh** - Click Apply when you need latest data
4. **Session boundaries** - Data auto-updates when sessions close

### For Developers
1. **Monitor cache hits** - Check browser console for cache usage
2. **Adjust CACHE_EXPIRY_MS** - Currently 30 minutes
3. **Session times** - Update in `lib/sessionBoundaries.ts` if needed
4. **localStorage size** - Current cache is ~10-50KB per user

## Testing

### Test Cache Behavior
1. Load page → Should see cached data (if available)
2. Change filters → Should use cache (no API call)
3. Click Apply → Should fetch fresh data
4. Reload page → Should load from cache

### Test Session Boundaries
1. Set time near session close (e.g., 3:59 PM for NY)
2. Wait for session to close (4:00 PM)
3. Click Apply → Should fetch fresh data
4. Cache from before session close should be invalid

### Check Console Logs
Open F12 and look for:
- `📦 Loading cached data` - Cache hit
- `⚡ Using cached data` - Skipping fetch
- `🚀 Fetching fresh trading data` - New API call
- `💾 Data cached` - Cache saved

## Troubleshooting

### Data seems stale?
- Click **Apply** to force refresh
- Check "Last updated" time in status bar
- Verify session hasn't closed recently

### Too many API calls?
- Check console for cache logs
- Verify cache is working (localStorage)
- Ensure CACHE_EXPIRY_MS is reasonable (30min default)

### Cache not working?
- Check browser localStorage is enabled
- Clear browser data and reload
- Check console for cache errors

## Future Enhancements

Possible improvements:
- [ ] Background refresh at exact session boundaries
- [ ] Cache per instrument/session combination
- [ ] IndexedDB for larger cache storage
- [ ] Service Worker for offline support
- [ ] WebSocket for real-time updates
- [ ] Progressive data loading

## Summary

✅ **70-80% reduction** in API calls  
✅ **Instant page loads** with cache  
✅ **Fresh data** at session boundaries  
✅ **Manual control** with Apply button  
✅ **Transparent** with status bar and logs  
✅ **Rate-limit friendly** for free tier  

This optimization ensures your app stays within API limits while providing a fast, responsive user experience! 🚀

