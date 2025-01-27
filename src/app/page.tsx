import type { User } from 'lucia';
import {
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import Container from '@/components/Container';
import { SignIn } from '@/components/SignIn';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { validateRequest } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <Container
      className={cn(`max-w-[72rem] gap-16 bg-gradient-to-b from-transparent from-80% to-base-100`)}
    >
      <ScrollArea className={cn(`flex h-full w-full flex-col gap-4`)}>
        <Hero user={user} />
        <About />
      </ScrollArea>
    </Container>
  );
}

const Hero = ({ user }: { user: User | null }) => {
  return (
    <div
      className={cn(
        `flex w-full flex-col items-center text-balance bg-gradient-to-b from-base-300 to-transparent px-4 pt-16 text-center`
      )}
    >
      <div className={cn(`max-w-xl`)}>
        <h1 className={cn(`text-5xl font-black`)}>
          The game master's inspirational{' '}
          <span
            className={cn(`bg-gradient-to-br from-error to-warning bg-clip-text text-transparent`)}
          >
            session planning toolkit
          </span>
        </h1>
        <p className={cn(`py-6 text-base-content/75`)}>
          PartyRoomBloom scaffolds your exploration scenes to help you plan engaging game nights
          better than ever.
        </p>
      </div>
      <div className={cn(`flex gap-8 max-sm:flex-col`)}>
        <Link
          href={`/outline/tutorial`}
          role={`none`}
          tabIndex={-1}
        >
          <Button
            color={`primary`}
            role={`link`}
            size={`wide`}
          >
            How it works
            <GraduationCap
              aria-hidden={true}
              className={cn(`size-5`)}
            />
          </Button>
        </Link>
        {user ? (
          <Link
            href={`/overview`}
            role={`none`}
            tabIndex={-1}
          >
            <Button
              color={`neutral`}
              role={`link`}
              size={`wide`}
            >
              Go to overview
              <ArrowRight
                aria-hidden={true}
                className={cn(`size-5`)}
              />
            </Button>
          </Link>
        ) : (
          <SignIn className={cn(`btn-wide`)} />
        )}
      </div>
    </div>
  );
};

const About = () => {
  const features = [
    {
      title: (
        <span>
          Exploration planning <span className={cn(`text-secondary`)}>made easy</span>
        </span>
      ),
      description: (
        <span>
          Always have a plan for player exploration. PartyRoomBloom's{' '}
          <span className={cn(`text-secondary`)}>Outline Builder</span> uses a tried-and-tested
          exploration framework, sure to draw your players' attention where it needs to be without
          railroading them! Say goodbye to feeling lost planning and running the exploration scenes
          of your sessions.
        </span>
      ),
      imgSrc: 'https://cmt76lyntq.ufs.sh/f/uvtHsYCzVSYq7sFXn66Qhdeki6VKaqoOupjLYXb4INxMycAl',
      imgAlt: 'Image of Outline Builder',
    },
    {
      title: (
        <span>
          <span className={cn(`text-info`)}>Easily reference</span> your outlines
        </span>
      ),
      description: (
        <span>
          The <span className={cn(`text-info`)}>Overview Page</span> provides an extremely
          convenient single-page interface for viewing an entire session's worth of scenes, allowing
          you to run a series of explorations from a single tab or window. No more scrolling up and
          down your session document!
        </span>
      ),
      imgSrc: 'https://cmt76lyntq.ufs.sh/f/uvtHsYCzVSYq5L4MSTXQuSiydK38UMNGnRkeXZ0BroTvCH7z',
      imgAlt: 'Image of Overview Page',
    },
    {
      title: (
        <span>
          <span className={cn(`text-indigo-500`)}>Simulate and extend</span> your ideas
        </span>
      ),
      description: (
        <span>
          PartyRoomBloom's <span className={cn(`text-indigo-500`)}>Simulate Assistant</span> walks
          you through your scenes, making sure you've left no stone unturned. Occasionally, it might
          even spark your imagination and send you back to the drawing board to add more ideas to
          your scene outlines!
        </span>
      ),
      imgSrc: 'https://cmt76lyntq.ufs.sh/f/uvtHsYCzVSYquPno0fCzVSYq3AlxZQWGPNMT85uhptaFeBCJ',
      imgAlt: 'Image of Simulate Assistant',
    },
    {
      title: (
        <span>
          <span className={cn(`text-orange-500`)}>Print and backup</span> your work
        </span>
      ),
      description: (
        <span>
          Should you want to take your plans offline,{' '}
          <span className={cn(`text-orange-500`)}>print them as PDFs</span>, and back them up on
          your own machine as JSON files, ready to add back to a new outline. (This feature is great
          when characters return to a place after it's changed!)
        </span>
      ),
      imgSrc: 'https://cmt76lyntq.ufs.sh/f/uvtHsYCzVSYq55Agb4XQuSiydK38UMNGnRkeXZ0BroTvCH7z',
      imgAlt: 'Image of PDF Saving',
    },
  ];

  return (
    <div
      className={cn(
        `item-center grid grid-cols-2 gap-16 text-balance bg-gradient-to-b from-transparent to-indigo-950 px-4 pb-16 pt-16 sm:px-16`
      )}
    >
      {features.map((feature, index) => (
        <Card
          key={index}
          className={cn(
            `col-span-2 items-center justify-end bg-base-100/75 text-center shadow-xl shadow-base-300 lg:col-span-1`
          )}
        >
          <CardContent className={cn(`flex h-full flex-col-reverse justify-end gap-4`)}>
            <div className={cn(`flex max-w-96 flex-col gap-4 py-4`)}>
              <h2 className={cn(`text-3xl font-bold`)}>{feature.title}</h2>
              <span>{feature.description}</span>
            </div>
            <AspectRatio
              ratio={4 / 3}
              className={`h-full`}
            >
              <Image
                src={feature.imgSrc}
                alt={feature.imgAlt}
                width={800}
                height={600}
                className={cn(`mt-4 h-full rounded-xl object-cover pt-4`)}
              />
            </AspectRatio>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
