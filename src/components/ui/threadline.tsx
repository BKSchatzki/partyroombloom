import React from 'react';

import {
  cva,
  type VariantProps,
} from 'class-variance-authority';

import { cn } from '@/lib/utils';

const threadlineVariants = cva('threadline', {
  variants: {
    color: {
      baseContent: 'before:bg-base-content',
      base100: 'before:bg-base-100',
      base200: 'before:bg-base-200',
      base300: 'before:bg-base-300',
      primary: 'before:bg-primary',
      secondary: 'before:bg-secondary',
      accent: 'before:bg-accent',
      neutral: 'before:bg-neutral',
      info: 'before:bg-info',
      success: 'before:bg-success',
      warning: 'before:bg-warning',
      error: 'before:bg-error',
    },
    defaultVariants: {
      color: 'base300',
    },
  },
});

export interface threadlineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof threadlineVariants> {}

const Threadline = React.forwardRef<HTMLDivElement, threadlineProps>(
  ({ className, color, /* position, */ ...props }, ref) => {
    return (
      <div
        className={cn(
          `flex flex-col gap-2 opacity-50 before:absolute before:left-1 before:top-0 before:h-full before:w-0.5`,
          threadlineVariants({ color, className })
        )}
        ref={ref}
        {...props}
      ></div>
    );
  }
);

Threadline.displayName = 'Threadline';

export { Threadline, threadlineVariants };
