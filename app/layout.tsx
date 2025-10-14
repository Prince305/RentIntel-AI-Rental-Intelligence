import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { OrgProvider } from '@/lib/org-context';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RentIntel - AI-Driven Rental Property Intelligence',
  description: 'Maximize your rental property returns with AI-powered insights, market intelligence, and portfolio management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <OrgProvider>
            {children}
            <Toaster />
          </OrgProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
