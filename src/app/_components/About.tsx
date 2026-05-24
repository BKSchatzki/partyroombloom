import Image from 'next/image';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const About = () => {
  const features = [
    {
      title: (
        <span>
          Exploration planning <span className={cn(`text-secondary`)}>made easy</span>
        </span>
      ),
      description: (
        <p>
          Always have a plan for player exploration. PartyRoomBloom's{' '}
          <span className={cn(`text-secondary`)}>Outline Builder</span> uses a tried-and-tested
          exploration framework, sure to draw your players' attention where it needs to be without
          railroading them! Say goodbye to feeling lost planning and running the exploration scenes
          of your sessions.
        </p>
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
        <p>
          The <span className={cn(`text-info`)}>Overview Page</span> provides an extremely
          convenient single-page interface for viewing an entire session's worth of scenes, allowing
          you to run a series of explorations from a single tab or window. No more scrolling up and
          down your session document!
        </p>
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
        <p>
          PartyRoomBloom's <span className={cn(`text-indigo-500`)}>Simulate Assistant</span> walks
          you through your scenes, making sure you've left no stone unturned. Occasionally, it might
          even spark your imagination and send you back to the drawing board to add more ideas to
          your scene outlines!
        </p>
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
        <p>
          Should you want to take your plans offline,{' '}
          <span className={cn(`text-orange-500`)}>print them as PDFs</span>, and back them up on
          your own machine as JSON files, ready to add back to a new outline. (This feature is great
          when characters return to a place after it's changed!)
        </p>
      ),
      imgSrc: 'https://cmt76lyntq.ufs.sh/f/uvtHsYCzVSYq55Agb4XQuSiydK38UMNGnRkeXZ0BroTvCH7z',
      imgAlt: 'Image of PDF Saving',
    },
  ];

  return (
    <div
      className={cn(
        `grid w-full min-w-0 grid-cols-1 items-center gap-16 bg-linear-to-b from-transparent to-indigo-950 px-4 pt-16 text-balance sm:px-16 lg:grid-cols-2`
      )}
    >
      {features.map((feature, index) => (
        <Card
          key={index}
          className={cn(
            `bg-base-100/75 shadow-base-300 w-full min-w-0 items-center justify-end overflow-hidden text-center shadow-xl`
          )}
        >
          <CardContent
            className={cn(`flex h-full w-full min-w-0 flex-col-reverse justify-end gap-4`)}
          >
            <div className={cn(`flex w-full max-w-96 flex-col gap-4 py-4`)}>
              <h2 className={cn(`text-3xl font-bold`)}>{feature.title}</h2>
              {feature.description}
            </div>
            <AspectRatio
              ratio={4 / 3}
              className={cn(`w-full overflow-hidden`)}
            >
              <Image
                src={feature.imgSrc}
                alt={feature.imgAlt}
                width={800}
                height={600}
                className={cn(`mt-4 h-full w-full rounded-xl object-cover`)}
              />
            </AspectRatio>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default About;
