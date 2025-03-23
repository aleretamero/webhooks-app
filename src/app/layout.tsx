import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/atoms/sonner';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WebhookAPP',
  description: 'WebhookAPP is a simple webhook application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="container mx-auto p-4 md:px-6 max-w-6xl">
          <h1 className="text-3xl font-bold">
            <Link href="/">WebhookAPP</Link>
          </h1>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
