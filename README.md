# IBLevels - Initial Balance Trading Analysis

A professional web application for analyzing futures contract initial balance (IB) levels and trading data across different trading sessions (Asia, London, New York).

## Features

- **Real-time Data**: Fetch historical trading data from Yahoo Finance
- **Multiple Instruments**: Track ES, MES, NQ, MNQ, GC, MGC, CL, MCL (mini and micro contracts)
- **Initial Balance Calculation**: Analyze 1-hour and 15-minute initial balance periods
- **Interactive Charts**: TradingView lightweight charts with IB level overlays
- **Session Filtering**: Filter data by Asia, London, or New York trading sessions
- **Responsive Design**: Modern UI with IBKR-inspired design, optimized for all devices

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: TailwindCSS
- **Charts**: TradingView Lightweight Charts
- **Data Source**: Yahoo Finance API (yahoo-finance2)
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Select Instruments**: Choose from available mini and micro futures contracts
2. **Set Date Range**: Default is last 30 days, customize as needed
3. **Choose Session**: Select Asia, London, or New York trading session
4. **Apply Filters**: Click "Apply Filters" to fetch and display data
5. **Analyze**: View charts, initial balance metrics, and detailed trading levels

## Initial Balance (IB)

The Initial Balance represents the price range established during the first period of a trading session:

- **IB 1H**: High and low during the first hour
- **IB 15M**: High and low during the first 15 minutes

These levels are displayed as overlays on the charts:
- Solid lines: 1-hour IB levels
- Dashed lines: 15-minute IB levels

## Trading Sessions

- **Asia Session**: 6:00 PM - 3:00 AM ET
- **London Session**: 3:00 AM - 12:00 PM ET
- **New York Session**: 9:30 AM - 4:00 PM ET

## Project Structure

```
/app
  /api/trading-data/route.ts - API endpoint for fetching trading data
  layout.tsx - Root layout with metadata
  page.tsx - Main dashboard page
  globals.css - Global styles
/components
  InstrumentSelector.tsx - Instrument selection component
  DateSelector.tsx - Date range picker
  SessionSelector.tsx - Session filter buttons
  FilterPanel.tsx - Combined filter panel
  TradingChart.tsx - TradingView chart component
  InitialBalanceCard.tsx - IB metrics card
  TradingLevelsTable.tsx - Data table
  AdPlacement.tsx - Advertisement placeholder
/lib
  types.ts - TypeScript type definitions
  instruments.ts - Instrument configuration
  sessionTimes.ts - Trading session definitions
  calculations.ts - IB calculation functions
  yahooFinance.ts - Data fetching utilities
```

## Build for Production

```bash
npm run build
npm start
```

## License

This project is for educational and personal use.

## Data Disclaimer

Market data is provided by Yahoo Finance. This application is for informational purposes only and should not be used as the sole basis for investment decisions.

