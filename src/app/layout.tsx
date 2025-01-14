import '@/styles/globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Nav from '@/components/Nav';
import Providers from '@/components/Providers';
import { validateRequest } from '@/lib/auth';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PartyRoomBloom',
  description: 'Bloom the Party Room!',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();

  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <Providers>
          <div className={cn(`grid h-screen grid-rows-[auto,1fr] text-base-content`)}>
            <Nav user={user} />
            <main
              className={cn(
                `no-scrollbar bg-flowers flex flex-col items-center justify-start overflow-y-scroll`
              )}
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
