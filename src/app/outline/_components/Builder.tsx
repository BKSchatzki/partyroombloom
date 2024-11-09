'use client';

import { useState } from 'react';

import { useAtom } from 'jotai';
import { Save } from 'lucide-react';
import router from 'next/router';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { outlineAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';

import Info from './Info';
import InteractablesContainer from './InteractablesContainer';
import LandmarksContainer from './LandmarksContainer';
import Review from './Review';
import SecretsContainer from './SecretsContainer';

const Builder = () => {
  const [outline, setOutline] = useAtom(outlineAtom);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outline }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      // router.push(`/outlines/${data.id}`);
    } catch (error) {
      console.error('Error saving outline:', error);
    } finally {
      setIsSaving(false);
    }
  };

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
            onClick={handleSave}
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
