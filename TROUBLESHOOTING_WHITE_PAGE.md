# Troubleshooting: White Page Issue

## Quick Fix

The white page is likely caused by corrupted browser cache. Try these steps:

### Method 1: Clear Browser Data (Recommended)

1. Open your browser to **http://localhost:3002**
2. Press **F12** to open DevTools
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **Clear site data** or **Clear Storage**
5. Hard refresh: **Ctrl+Shift+R** (Windows) / **Cmd+Shift+R** (Mac)

### Method 2: Clear localStorage Manually

1. Press **F12** → **Console** tab
2. Paste this command and press Enter:
   ```javascript
   localStorage.clear(); location.reload();
   ```

### Method 3: Incognito/Private Mode

1. Open a new **Incognito/Private** window
2. Go to **http://localhost:3002**
3. This bypasses all cached data

## Check Console for Errors

With DevTools open (F12), go to the **Console** tab. You should see:

### ✅ Correct Output:
```
🚀 No valid cache, will fetch fresh data
📍 Auto-fetch useEffect triggered
✅ Triggering fetch...
🔄 fetchTradingData called
🚀 Fetching fresh trading data
[YahooFinance] Fetching ES=F from Yahoo Finance...
[YahooFinance] Successfully fetched 672 bars for ES=F
📊 Data Source: Yahoo Finance (Real Futures Data)
✅ Loaded 14 trading levels
```

### ❌ If You See Errors:
- **CORS errors**: Shouldn't happen on localhost
- **Network errors**: Check if dev server is running on correct port
- **Parse errors**: Old cached data is corrupted

## Verify Dev Server

Make sure the server is running:

```bash
# Check what's running
lsof -i :3002

# If needed, restart
npm run dev
```

## Test API Directly

Open this URL in your browser:
```
http://localhost:3002/api/trading-data?instruments=ES&startDate=2025-10-24T00:00:00.000Z&endDate=2025-10-31T23:59:59.000Z&session=NewYork
```

You should see JSON data with correct prices (ES around 6,900).

## Still Having Issues?

### Check Browser Console for Specific Errors

1. Look for **red error messages**
2. Look for **failed fetch requests**
3. Screenshot any errors and check them

### Nuclear Option: Complete Reset

```bash
# Stop all servers
killall node

# Clear all caches
rm -rf .next
rm -rf node_modules/.cache

# Restart
npm run dev
```

Then clear browser data again.

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| White page, no errors | Old cached data from ETF version | Clear localStorage |
| "Failed to fetch" | Port mismatch | Check server is on 3002 |
| Network errors | Server not running | Run `npm run dev` |
| Parse errors | Corrupted cache | Clear localStorage |
| Component errors | Build issue | Delete `.next` and rebuild |

## Expected Behavior

After clearing cache, you should see:

1. **Filter Panel** at the top with ES and NQ selected
2. **Loading spinner** briefly
3. **Trading Levels Table** with data showing ES around 6,900
4. **Charts** below with Initial Balance lines
5. **No white screen!**

---

*If none of these work, check the browser console and share any error messages.*

