import Container from '@/components/Container';
import { cn } from '@/lib/utils';

const Loading = () => {
  return (
    <Container className={cn(`max-w-[72rem] gap-16`)}>
      <div className={cn(`flex h-full w-full flex-col items-center rounded-none p-16`)}>
        <span className={cn(`loading loading-spinner loading-lg`)}></span>
      </div>
    </Container>
  );
};

export default Loading;
