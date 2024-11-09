'use client';

import { Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import Info from './Info';
import InteractablesContainer from './InteractablesContainer';
import LandmarksContainer from './LandmarksContainer';
import Review from './Review';
import SecretsContainer from './SecretsContainer';

const Builder = () => {
  return (
    <Carousel className={cn(`h-full max-w-full`)}>
      <div className={cn(`flex max-h-full flex-col pb-4`)}>
        <CarouselContent>
          <CarouselItem className={cn(`basis-full py-4`)}>
            <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 px-4 pb-4`)}>
              <Info />
            </ScrollArea>
          </CarouselItem>
          <CarouselItem className={cn(`basis-full py-4`)}>
            <LandmarksContainer />
          </CarouselItem>
          <CarouselItem className={cn(`basis-full py-4`)}>
            <InteractablesContainer />
          </CarouselItem>
          <CarouselItem className={cn(`basis-full py-4`)}>
            <SecretsContainer />
          </CarouselItem>
          <CarouselItem className={cn(`basis-full py-4`)}>
            <Review />
          </CarouselItem>
        </CarouselContent>
        <div className={cn(`relative h-16`)}>
          <CarouselPrevious />
          <CarouselNext />
          <Button
            color={`secondary`}
            outlined={true}
            className={cn(`absolute bottom-0 right-20 flex items-center gap-2`)}
          >
            <Save className={cn(`size-5`)} />
            Save Outline
          </Button>
        </div>
      </div>
    </Carousel>
  );
};

export default Builder;
