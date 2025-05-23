import {
  AuthProvider,
  DirectionProvider,
  I18nProvider,
  QueryProvider,
} from '@providers/index';
import { ThemeProvider } from 'next-themes';
import { cn } from '@lib/utils';
import { Toaster } from '@reui/ui/sonner';
import Analytics from '@reui/analytics';
import '@/styles/globals.css';
import { ReactNode, Suspense } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kids Church',
  description: 'Victory Dasmarinas',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html className="h-full" suppressHydrationWarning>
      <body className={cn('flex h-full text-base antialiased', inter.className)}>
        <AuthProvider>
          <I18nProvider>
            <DirectionProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
                enableColorScheme
              >
                <QueryProvider>
                  <Suspense>
                    {children}
                    <Analytics />
                  </Suspense>
                </QueryProvider>
                <Toaster />
              </ThemeProvider>
            </DirectionProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
