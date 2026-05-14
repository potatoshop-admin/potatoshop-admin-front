import React from 'react';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import Providers from '@/app/reactQueryProviders';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const pretendard = localFont({
  src: '../../public/fonts/pretendard/PretendardVariable.woff2',
  display: 'swap',
  weight: '100 900',
  variable: '--font-pretendard',
  preload: true, // 기본값이지만 의도 명시 — <link rel="preload"> 자동 삽입
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'], // 폰트 로드 전 폴백 명시
  adjustFontFallback: 'Arial', // 폴백→웹폰트 swap 시 레이아웃 시프트 자동 보정
});

export const metadata: Metadata = {
  title: 'Potato Admin',
  description: 'the site for admin of clothe store',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pretendard.variable} suppressHydrationWarning>
      <body className={`${pretendard.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
