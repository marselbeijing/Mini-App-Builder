import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MUIProvider } from '@/components/MUIProvider';
import { TelegramProvider } from '@/components/TelegramProvider';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Mini App Builder',
  description: 'Create your own Telegram Mini App in minutes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MUIProvider>
          <TelegramProvider>
        {children}
          </TelegramProvider>
        </MUIProvider>
      </body>
    </html>
  );
}
