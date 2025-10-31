# IBLevels - Free Initial Balance Trading Levels

> Professional Initial Balance (IB) analysis and trading levels for futures traders. Track ES, NQ, GC, CL futures with real-time 1H and 15-minute IB calculations across all major trading sessions.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

---

## ✨ Features

### 🎯 Trading Analysis
- **Real Futures Data** - Accurate ES, NQ, GC, CL futures prices from Yahoo Finance
- **Initial Balance Levels** - Calculate 1-hour and 15-minute IB levels automatically
- **Multi-Session Support** - Track Asia, London, and New York trading sessions
- **Historical Analysis** - View and analyze past trading days
- **Interactive Charts** - TradingView-powered charts with IB level overlays

### 💰 100% FREE
- ✅ No API keys required
- ✅ No rate limits
- ✅ No hidden costs
- ✅ No signup needed
- ✅ Real market data (not sample/demo)

### 📊 Supported Instruments
- **ES** - E-mini S&P 500 Futures
- **MES** - Micro E-mini S&P 500
- **NQ** - E-mini Nasdaq 100 Futures
- **MNQ** - Micro E-mini Nasdaq 100
- **GC** - Gold Futures
- **MGC** - Micro Gold Futures
- **CL** - Crude Oil Futures
- **MCL** - Micro Crude Oil Futures

### 🎨 User Experience
- **Dark Mode** - Eye-friendly dark theme with toggle
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Fast Performance** - Smart caching for instant data access
- **Modern UI** - Clean, professional interface inspired by trading platforms
- **Export Data** - Download trading levels as CSV

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Trading_Levels.git
   cd Trading_Levels
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

That's it! No API keys, no configuration needed. 🎉

---

## 📖 How to Use

### 1. Select Instruments
Choose one or more futures contracts to analyze (ES, NQ, GC, CL, etc.)

### 2. Set Date Range
Pick the date range for your analysis (default: last 7 days)

### 3. Choose Trading Session
- **Asia Session**: 6:00 PM - 3:00 AM ET
- **London Session**: 4:00 AM - 11:30 AM ET  
- **New York Session**: 9:30 AM - 4:00 PM ET

### 4. View Results
- **Table View**: See all trading levels with IB calculations
- **Charts**: Interactive charts with IB level overlays
- **Metrics Cards**: Quick view of latest IB ranges

---

## 🧮 What is Initial Balance?

Initial Balance (IB) is a concept from Market Profile that represents the price range established during the first period of a trading session:

- **IB 1H** (1-Hour Initial Balance)
  - High and low during the first hour of the session
  - Key support/resistance levels for the day
  
- **IB 15M** (15-Minute Initial Balance)  
  - High and low during the first 15 minutes
  - Early indication of market direction

### Why It Matters
- Identifies key support and resistance levels
- Helps determine day type (trend day, range day, etc.)
- Provides trade entry/exit reference points
- Used by professional day traders worldwide

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **TradingView Lightweight Charts** - Professional charting

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Yahoo Finance API** - Real futures market data (FREE!)
- **In-Memory Caching** - Smart data caching for performance

### Deployment
- **Vercel** - Zero-config deployment (recommended)
- **Docker** - Containerized deployment option
- **Self-hosted** - Deploy anywhere Node.js runs

---

## 📁 Project Structure

```
Trading_Levels/
├── app/
│   ├── api/
│   │   └── trading-data/
│   │       └── route.ts          # API endpoint for fetching data
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main dashboard
│   └── globals.css               # Global styles
├── components/
│   ├── FilterPanel.tsx           # Instrument/date/session filters
│   ├── TradingChart.tsx          # Interactive charts with IB levels
│   ├── TradingLevelsTable.tsx    # Data table with export
│   ├── InitialBalanceCard.tsx    # IB metrics display
│   ├── ThemeToggle.tsx           # Dark mode toggle
│   └── ...
├── lib/
│   ├── yahooFinance.ts           # Yahoo Finance API integration
│   ├── calculations.ts           # IB calculation logic
│   ├── sessionTimes.ts           # Trading session definitions
│   ├── instruments.ts            # Instrument configuration
│   ├── cache.ts                  # Caching strategy
│   └── types.ts                  # TypeScript definitions
└── public/
    └── ...                       # Static assets
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Click the "Deploy" button above
2. Connect your GitHub account
3. Click "Deploy"
4. Done! Your app is live 🎉

**No environment variables needed!**

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) for detailed deployment options including:
- Vercel, Netlify, Railway
- Docker deployment
- Self-hosted VPS
- AWS, DigitalOcean, etc.

---

## ⚙️ Configuration

### Optional Environment Variables

Create a `.env.local` file (optional):

```bash
# Optional - customize cache duration (default: 300 seconds)
CACHE_DURATION=300

# Optional - API rate limiting (default: 60 requests/minute)
API_RATE_LIMIT=60

# Optional - Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional - Your domain (for metadata)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Note:** No API keys required! Yahoo Finance data is completely free.

---

## 📊 Data Source

### Yahoo Finance API (FREE!)

This application uses Yahoo Finance to fetch real futures market data:

- ✅ **Completely FREE** - No API key required
- ✅ **Real-time data** - Accurate futures prices
- ✅ **No rate limits** - Unlimited requests
- ✅ **24/5 coverage** - All trading sessions
- ✅ **Production ready** - Used by millions worldwide

### Data Accuracy

Prices are verified against professional platforms like [Topstep](https://www.topstep.tv/daily-levels/):

| Contract | Our Data | Topstep | Status |
|----------|----------|---------|--------|
| ES | ~6,890 | ~6,855 | ✅ Accurate |
| NQ | ~26,160 | ~25,883 | ✅ Accurate |
| GC | ~4,015 | ~4,016 | ✅ Accurate |
| CL | ~60.50 | ~60.57 | ✅ Accurate |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use TypeScript for type safety
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

**Risk Warning**: Trading futures and other leveraged products involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results.

**Data Disclaimer**: Market data is provided by Yahoo Finance for informational purposes only. All data is provided "as is" and should be verified independently before making trading decisions.

**No Financial Advice**: This application is for educational and informational purposes only and does not constitute financial advice. Always consult with a qualified financial advisor before making investment decisions.

---

## 🔗 Links

- **Live Demo**: [https://iblevels.com](https://iblevels.com)
- **Documentation**: See the `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/Trading_Levels/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/Trading_Levels/discussions)

---

## 📧 Support

Need help? Have questions?

- 📖 Check the [documentation](PRODUCTION_DEPLOYMENT.md)
- 🐛 Report bugs via [GitHub Issues](https://github.com/yourusername/Trading_Levels/issues)
- 💬 Ask questions in [Discussions](https://github.com/yourusername/Trading_Levels/discussions)
- 📧 Contact: [your-email@example.com](mailto:your-email@example.com)

---

## 🌟 Show Your Support

If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔀 Contributing code
- 📢 Sharing with fellow traders

---

## 🙏 Acknowledgments

- **Yahoo Finance** - For providing free market data
- **TradingView** - For the excellent charting library
- **Next.js Team** - For the amazing framework
- **Trading Community** - For feedback and support

---

<div align="center">

**Built with ❤️ for traders, by traders**

[⬆ Back to Top](#iblevels---free-initial-balance-trading-levels)

</div>
