import Container from '@/components/Container';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { toClientUser, validateRequest } from '@/lib/auth';
import { cn } from '@/lib/utils';

import About from './_components/About';
import Acknowledgements from './_components/Acknowledgements';
import Faq from './_components/Faq';
import Hero from './_components/Hero';

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <Container
      className={cn(`to-base-100 max-w-6xl gap-16 bg-linear-to-b from-transparent from-80%`)}
    >
      <ScrollArea className={cn(`flex h-full w-full flex-col gap-4`)}>
        <Hero user={user ? toClientUser(user) : null} />
        <About />
        <Faq />
        <Acknowledgements />
        <StarsBackground
          starDensity={0.0003}
          className={cn(`-z-10`)}
        />
        <ShootingStars className={cn(`-z-10`)} />
      </ScrollArea>
    </Container>
  );
}
