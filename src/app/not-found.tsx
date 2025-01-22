'use client';

import { useEffect } from 'react';

import {
  Grid2X2,
  Home,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={cn(`flex h-full flex-col items-center justify-center gap-8`)}>
      <h2 className={cn(`text-xl font-bold`)}>Hmmm. It must be here somewhere.</h2>
      <div className={`join`}>
        <Link
          href={`/overview`}
          role={`none`}
          tabIndex={-1}
        >
          <Button
            color={`default`}
            outlined={true}
            role={`link`}
            className={cn(`btn btn-outline join-item btn-md flex items-center gap-2`)}
          >
            <Grid2X2
              aria-hidden={true}
              className={cn(`size-5`)}
            />
            Back to Overview
          </Button>
        </Link>
        <Link href={`/`}>
          <Button
            color={`default`}
            outlined={true}
            className={cn(`btn btn-outline join-item btn-md flex items-center gap-2`)}
          >
            <Home
              aria-hidden={true}
              className={cn(`size-5`)}
            />
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Error;
