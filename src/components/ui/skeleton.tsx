import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-base-300/50 shadow-base-300 animate-pulse rounded-[1rem] shadow-xl max-sm:rounded-none',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
