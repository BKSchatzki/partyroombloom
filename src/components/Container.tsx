import React from 'react';

import { cn } from '@/lib/utils';

const Container = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className: string;
}) => {
  return (
    <div
      className={cn(
        `bg-base-100 flex h-full w-full max-w-[48rem] flex-col items-center justify-start`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
