import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FamilyProvider } from '@/lib/store/familyStore';
import PWAProvider from '@/components/pwa/PWAProvider';

export const viewport: Viewport = {
  themeColor: '#10263A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Family Wealth & Stock SuperApp',
  description: 'Single SuperApp for Family Wealth, Asset Vault, SEBI-compliant AI Stock Predictions, Screener & F&O Analytics.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/app-icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/app-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SuperApp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10263A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-[#E7E1D2] antialiased">
        <FamilyProvider>
          <PWAProvider>
            {children}
          </PWAProvider>
        </FamilyProvider>
      </body>
    </html>
  );
}
