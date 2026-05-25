import '@/styles/globals.css';

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import Nav from '@/components/Nav';
import Providers from '@/components/Providers';
import { toClientUser, validateRequest } from '@/lib/auth';
import { getSiteUrl } from '@/lib/env';
import { cn } from '@/lib/utils';

const inter = localFont({
  src: './fonts/inter-latin.woff2',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  weight: '100 900',
});

export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'PartyRoomBloom',
  description: "The game master's inspirational session planning toolkit",
  metadataBase: new URL(getSiteUrl()),
  applicationName: 'PartyRoomBloom',
  authors: [{ name: 'Brendan K. Schatzki' }],
  generator: 'Next.js',
  keywords: ['tabletop roleplaying games', 'session planning', 'social gaming'],
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
};

export const viewport: Viewport = {
  themeColor: '#1db88e',
  width: 'device-width',
  initialScale: 1,
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
          <div className={cn(`text-base-content grid h-dvh min-h-0 grid-rows-[auto_1fr]`)}>
            <Nav user={user ? toClientUser(user) : null} />
            <main
              className={cn(
                `no-scrollbar bg-flowers flex min-h-0 flex-col items-center justify-start overflow-y-auto`
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
