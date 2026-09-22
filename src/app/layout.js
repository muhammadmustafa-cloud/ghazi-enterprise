import './globals.css';
import { DM_Sans, Syne } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['500', '600', '700', '800'],
});

export const metadata = {
  title: 'Ghazi Enterprise | Industrial Packaging',
  description: 'Premium corrugated boxes, packaging tape, and custom industrial packaging solutions in Pakistan.',
};

import ClientProviders from '@/components/ClientProviders';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="min-h-screen">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
