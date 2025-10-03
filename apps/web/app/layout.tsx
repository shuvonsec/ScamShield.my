import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { cn } from '@scamshield/ui/cn';
import { ThemeProvider } from '../components/theme-provider';

export const metadata: Metadata = {
  title: 'ScamShield.my & ShieldStack',
  description: 'AI-powered scam checker and SME hardening platform',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/icon-192x192.png' },
    { rel: 'apple-touch-icon', url: '/icon-512x512.png' }
  ]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn('min-h-full bg-slate-950 text-slate-100')}>
      <body className="min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
