import Container from '@/components/Container';
import { ScrollArea } from '@/components/ui/scroll-area';
import { validateRequest } from '@/lib/auth';
import { cn } from '@/lib/utils';

import About from './_components/About';
import Faq from './_components/Faq';
import Hero from './_components/Hero';

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <Container
      className={cn(`max-w-[72rem] gap-16 bg-gradient-to-b from-transparent from-80% to-base-100`)}
    >
      <ScrollArea className={cn(`flex h-full w-full flex-col gap-4`)}>
        <Hero user={user} />
        <About />
        <Faq />
      </ScrollArea>
    </Container>
  );
}
