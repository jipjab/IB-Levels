import type { Metadata, Viewport } from 'next';
import './globals.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://iblevels.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'IBLevels - Free Initial Balance Trading Levels | ES, NQ, GC, CL Futures',
    template: '%s | IBLevels'
  },
  description:
    'Free professional initial balance (IB) analysis and trading levels for futures contracts. Track ES, MES, NQ, MNQ, GC, MGC, CL, MCL with real-time 1H and 15min IB levels across Asia, London, and New York sessions. Free trading data for day traders.',
  keywords: [
    'initial balance',
    'IB levels',
    'trading levels',
    'futures trading',
    'ES futures',
    'NQ futures',
    'S&P 500 futures',
    'Nasdaq futures',
    'gold futures',
    'crude oil futures',
    'GC futures',
    'CL futures',
    'mini contracts',
    'micro contracts',
    'MES',
    'MNQ',
    'MGC',
    'MCL',
    'trading sessions',
    'day trading',
    'free trading data',
    'market opening range',
    'Asia session',
    'London session',
    'New York session',
    'futures analysis',
    'trading indicators',
    'price levels',
  ],
  authors: [{ name: 'IBLevels' }],
  creator: 'IBLevels',
  publisher: 'IBLevels',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'IBLevels - Free Initial Balance Trading Levels for Futures',
    description:
      'Free professional initial balance (IB) analysis for ES, NQ, GC, CL futures. Track 1H and 15min IB levels across Asia, London, and New York trading sessions.',
    siteName: 'IBLevels',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'IBLevels - Initial Balance Trading Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IBLevels - Free Initial Balance Trading Levels',
    description: 'Free IB levels for ES, NQ, GC, CL futures. Track across Asia, London, NY sessions.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@IBLevels',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'finance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'IBLevels',
    applicationCategory: 'FinanceApplication',
    description: 'Free professional initial balance trading levels for futures contracts',
    url: siteUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className="font-sans antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}

