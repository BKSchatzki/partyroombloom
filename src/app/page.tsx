'use client';

import { useState } from 'react';

import Link from 'next/link';

import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (isRedirecting)
    return (
      <Container>
        <div className={cn(`flex h-full w-full flex-col items-center rounded-none p-16`)}>
          <span className={cn(`loading loading-spinner loading-lg`)}></span>
        </div>
      </Container>
    );

  return (
    <Container className={cn(`max-w-[72rem] gap-16`)}>
      <div
        className={cn(
          `flex w-full flex-col items-center text-balance bg-gradient-to-b from-base-300 to-transparent py-16 text-center`
        )}
      >
        <div className={cn(`max-w-xl`)}>
          <h1 className={cn(`text-5xl font-black`)}>
            The game master's inspirational{' '}
            <span
              className={cn(
                `bg-gradient-to-br from-error to-warning bg-clip-text text-transparent`
              )}
            >
              session planning toolkit
            </span>
          </h1>
          <p className={cn(`py-6 text-base-content/75`)}>
            PartyRoomBloom scaffolds your exploration scenes to help you plan engaging game nights
            better than ever.
          </p>
        </div>
        <div className={cn(`flex gap-4`)}>
          <Link
            href={`/tutorial`}
            className={cn(`btn btn-primary`)}
          >
            How it works
          </Link>
          <Button
            onClick={() => setIsRedirecting(true)}
            className={cn(`btn btn-outline`)}
          >
            <Link href={`/login/google`}>Get started</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
