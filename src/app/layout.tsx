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
  description: "The game master's inspirational session planning toolkit",
  metadataBase: new URL('https://partyroombloom.vercel.app'),
  applicationName: 'PartyRoomBloom',
  authors: [{ name: 'Brendan K. Schatzki' }],
  generator: 'Next.js',
  keywords: ['tabletop roleplaying games', 'session planning', 'social gaming'],
  themeColor: '#1db88e', // Your brand color
  // manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    title: "PartyRoomBloom - The game master's inspirational session planning toolkit",
    description:
      'PartyRoomBloom scaffolds your exploration scenes to help you plan engaging game nights better than ever',
    siteName: 'PartyRoomBloom',
    // images: [
    //   {
    //     url: '/og-image.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'PartyRoomBloom Preview',
    //   },
    // ],
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   creator: '@yourhandle',
  //   images: '/twitter-image.jpg',
  // },
  // robots: {
  //   index: true,
  //   follow: true,
  // },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
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
