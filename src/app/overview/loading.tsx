import Container from '@/components/Container';
import { cn } from '@/lib/utils';

const Loading = () => {
  return (
    <Container>
      <div className={cn(`flex h-[172px] w-full items-center justify-center rounded-2xl`)}>
        <span className={cn(`loading loading-spinner loading-lg`)}></span>
      </div>
      <div
        className={cn(
          `flex h-[calc(100vh-14.5rem)] w-full flex-col items-center rounded-none p-16`
        )}
      >
        <span className={cn(`loading loading-spinner loading-lg`)}></span>
      </div>
    </Container>
  );
};

export default Loading;
