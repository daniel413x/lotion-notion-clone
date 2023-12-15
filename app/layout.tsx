import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import ConvexProvider from '@/components/providers/ConvexProvider';
import siteConfig from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/logo.svg',
        href: '/logo.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo-dark.svg',
        href: '/logo-dark.svg',
      },
    ],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({
  children,
}: RootLayoutProps) => (
  <html lang="en">
    <ConvexProvider>
      <body className={inter.className}>
        {children}
      </body>
    </ConvexProvider>
  </html>
);

export default RootLayout;
