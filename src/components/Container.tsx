import React from 'react';

import { cn } from '@/lib/utils';

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        `flex h-full w-full max-w-[48rem] flex-col items-center justify-start bg-base-100`
      )}
    >
      {children}
    </div>
  );
};

export default Container;
