'use client';

import { useEffect } from 'react';

import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Oops! Something went wrong!</h2>
      <p>Sorry about that!</p>
      <Button
        color={`glass`}
        onClick={() => reset()}
        className={cn(`flex items-center gap-2`)}
      >
        <RefreshCw className={cn(`size-5`)} />
        Try Again
      </Button>
    </div>
  );
};

export default Error;
