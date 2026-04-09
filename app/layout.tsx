import type { Metadata } from 'next';
import { Cabin, Fraunces } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';

const cabin = Cabin({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cabin',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quoriva - Research made readable',
  description: 'Find papers fast and turn complex abstracts into practical explanations for curious teams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${cabin.variable} ${fraunces.variable} flex flex-col min-h-screen`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}

