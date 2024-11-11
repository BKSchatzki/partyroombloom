import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[1rem] bg-base-300/50 shadow-xl shadow-base-300 max-sm:rounded-none',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
