import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@scamshield/ui';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ScamShield.my & ShieldStack',
  description:
    'AI-powered anti-scam checker for consumers and continuous security hardening for SMEs.',
  manifest: '/manifest.webmanifest',
  icons: [{ rel: 'icon', url: '/icon.svg', type: 'image/svg+xml' }]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, 'min-h-screen bg-slate-950 text-slate-100')}>
        {children}
      </body>
    </html>
  );
}
