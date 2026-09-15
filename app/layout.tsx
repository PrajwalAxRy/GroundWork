import type { Metadata, Viewport } from 'next';
import { DM_Sans, Geist, Geist_Mono, Manrope } from 'next/font/google';
import '@/styles/globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-groundwork-heading',
  display: 'swap',
});
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-groundwork-body', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f2f5f7',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Groundwork',
  title: {
    default: 'Groundwork — stress-test your startup idea',
    template: '%s — Groundwork',
  },
  description:
    'Shape a startup idea, investigate it using current evidence, and understand the road ahead.',
  openGraph: {
    type: 'website',
    siteName: 'Groundwork',
    url: '/',
    title: 'Groundwork — stress-test your startup idea',
    description:
      'Shape a startup idea, investigate it using current evidence, and understand the road ahead.',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'Groundwork startup idea workspace',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} ${manrope.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
