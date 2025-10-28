import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'IBLevels - Initial Balance Trading Analysis',
  description:
    'Professional initial balance (IB) analysis and trading levels for futures contracts including S&P 500, Nasdaq, Gold, and Crude Oil. Track 1H and 15min IB levels across Asia, London, and New York sessions.',
  keywords:
    'initial balance, IB levels, trading levels, futures, S&P 500, Nasdaq, Gold, Crude Oil, ES, NQ, GC, CL, mini contracts, micro contracts, trading sessions',
  openGraph: {
    title: 'IBLevels - Initial Balance Trading Analysis',
    description:
      'Professional initial balance analysis and trading levels for futures contracts',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

