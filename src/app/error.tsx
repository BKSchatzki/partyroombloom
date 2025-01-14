'use client';

import { useEffect } from 'react';

import {
  Grid2X2,
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
      <h2 className={cn(`text-xl font-bold`)}>Oops! Something went wrong!</h2>
      <div className={`join`}>
        <Link href={`/overview`}>
          <Button
            color={`default`}
            outlined={true}
            className={cn(`btn btn-outline join-item btn-md flex items-center gap-2`)}
          >
            <Grid2X2 className={cn(`size-4`)} />
            Back to Overview
          </Button>
        </Link>
        <Button
          color={`default`}
          outlined={true}
          onClick={() => reset()}
          className={cn(`btn btn-outline join-item btn-md flex items-center gap-2`)}
        >
          <RefreshCw className={cn(`size-4`)} />
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default Error;
