# Twelve Data API Setup Guide

## Step 1: Get Your API Key

1. Go to your Twelve Data account: https://twelvedata.com/account/api-keys
2. Copy your API key

## Step 2: Create Environment File

Create a file named `.env.local` in the root of your project (same folder as `package.json`):

```bash
# Twelve Data API Configuration
TWELVE_DATA_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your real API key from Twelve Data.

**Important:** Never commit this file to git. It's already in `.gitignore`.

## Step 3: Restart Development Server

After adding your API key, restart the development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Twelve Data API Details

### Supported Instruments
- **ES** - E-mini S&P 500 Futures
- **MES** - Micro E-mini S&P 500 Futures
- **NQ** - E-mini Nasdaq 100 Futures
- **MNQ** - Micro E-mini Nasdaq 100 Futures
- **GC** - Gold Futures
- **MGC** - Micro Gold Futures
- **CL** - Crude Oil Futures
- **MCL** - Micro Crude Oil Futures

### Data Intervals Used
- **15min** - For intraday Initial Balance calculations
- **1day** - For daily overview

### Rate Limits
Check your Twelve Data plan for rate limits:
- **Free Tier**: 800 API calls/day
- **Basic Plan**: Higher limits

The app fetches data when:
- You select instruments
- You change the date range
- You switch trading sessions

**Tip:** Each instrument + date range = 1 API call. Selecting multiple instruments will use multiple calls.

## Fallback Mode

If the API key is not configured or API calls fail, the app automatically falls back to sample/demo data so you can continue developing and testing the UI.

## Troubleshooting

### "No data returned"
- Check that your API key is correct
- Verify your Twelve Data account has access to futures data
- Check the browser console for detailed error messages

### "API rate limit exceeded"
- Wait for your daily limit to reset
- Consider upgrading your Twelve Data plan
- Use sample data mode for development

### "TWELVE_DATA_API_KEY not found"
- Make sure `.env.local` file exists in the project root
- Restart the development server after creating the file
- Check that the file is not named `.env.local.txt` (remove .txt extension)

## Testing the Integration

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Select instruments (ES, NQ)
4. Check the browser console for:
   - "Fetching ES from Twelve Data..."
   - "Successfully fetched X bars for ES"

If you see these messages, the integration is working! 🎉

## API Documentation

Full Twelve Data API docs: https://twelvedata.com/docs

## Support

Need help? Check:
- Twelve Data Support: https://twelvedata.com/support
- Your browser's developer console for error messages

