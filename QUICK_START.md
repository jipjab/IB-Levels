# Quick Start Guide

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How It Works

### Data Flow
1. User selects instruments, date range, and trading session
2. Frontend sends request to `/api/trading-data` API route
3. API fetches data from Yahoo Finance using `yahoo-finance2` package
4. Data is processed to calculate Initial Balance (IB) levels
5. Results are displayed in charts, cards, and tables

### Key Features Implemented

#### 1. Instrument Selection
- 8 futures contracts available (mini & micro)
- ES/MES (S&P 500)
- NQ/MNQ (Nasdaq)
- GC/MGC (Gold)
- CL/MCL (Crude Oil)

#### 2. Initial Balance Calculations
- **1 Hour IB**: High/low during first hour of session
- **15 Minute IB**: High/low during first 15 minutes
- Both displayed as overlays on charts

#### 3. Trading Sessions
- **Asia**: 6:00 PM - 3:00 AM ET
- **London**: 3:00 AM - 12:00 PM ET
- **New York**: 9:30 AM - 4:00 PM ET

#### 4. Advertisement Placement
- Located in right sidebar after IB cards
- SEO-friendly positioning (after main content in DOM)
- Clearly labeled with ARIA attributes
- Non-intrusive but visible placement

### Components Overview

**FilterPanel**: Combines all filter controls
- InstrumentSelector: Multi-select checkboxes
- DateSelector: Start/end date pickers
- SessionSelector: Trading session buttons

**TradingChart**: TradingView lightweight charts
- Candlestick display
- IB level overlays (solid & dashed lines)
- Interactive and responsive

**InitialBalanceCard**: Metric cards
- Latest IB data per instrument
- Color-coded price changes
- Session information

**TradingLevelsTable**: Detailed data table
- Sortable columns
- All OHLC data
- IB levels for both periods

**AdPlacement**: Advertisement component
- Positioned for optimal visibility
- SEO-compliant structure
- Easy to integrate with ad networks

## Customization

### Adding Ad Networks

Edit `components/AdPlacement.tsx`:

```tsx
const AdPlacement = () => {
  return (
    <aside className="..." aria-label="Advertisement">
      {/* Insert your ad network code here */}
      {/* Google Adsense, MediaVine, etc. */}
    </aside>
  );
};
```

### Modifying Instruments

Edit `lib/instruments.ts` to add/modify futures contracts.

### Changing Session Times

Edit `lib/sessionTimes.ts` to adjust trading hours.

## SEO Optimization

The application includes:
- Semantic HTML structure
- Proper meta tags in layout.tsx
- ARIA labels for accessibility
- Advertisement placement after primary content
- Descriptive page title and description

## Production Build

```bash
npm run build
npm start
```

## Troubleshooting

### Yahoo Finance API Issues
- Free tier has rate limits
- Some contracts may not have intraday data
- Historical data availability varies by contract

### Missing Data
- Ensure date range is not too far in the past
- Some micro contracts have limited history
- Weekend/holiday data may be sparse

### Performance
- Limit number of selected instruments for faster loading
- Reduce date range if experiencing slowness
- API responses are not cached by default

## Next Steps

1. **Integrate Real Ad Network**: Replace placeholder in AdPlacement.tsx
2. **Add Caching**: Implement Redis or similar for API responses
3. **Database Storage**: Store historical data to reduce API calls
4. **User Accounts**: Save user preferences and watchlists
5. **Real-time Updates**: Add WebSocket support for live data
6. **Mobile App**: Create React Native version

## Support

For issues or questions, refer to:
- README.md for detailed documentation
- Next.js docs: https://nextjs.org/docs
- TradingView charts: https://tradingview.github.io/lightweight-charts/
- Yahoo Finance API: https://github.com/gadicc/node-yahoo-finance2

