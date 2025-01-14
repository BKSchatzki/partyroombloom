'use client';

import { useState } from 'react';

import { useAtom } from 'jotai';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  outlineAtom,
  outlineInit,
  outlinesListAtom,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

import Info from './Info';
import InteractablesContainer from './InteractablesContainer';
import LandmarksContainer from './LandmarksContainer';
import Review from './Review';
import SecretsContainer from './SecretsContainer';

const Builder = ({ outlineId }: { outlineId: number | null }) => {
  const [outline, setOutline] = useAtom(outlineAtom);
  const [outlinesList] = useAtom(outlinesListAtom);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const router = useRouter();

  const { isLoading, error } = useQuery({
    queryKey: ['outline'],
    queryFn: async () => {
      if (outlineId === null) {
        setOutline(outlineInit);
        setIsLocalLoading(false);
        return outlineInit;
      }
      const preloadedOutline = outlinesList.find((outline) => outline.id === outlineId);
      if (preloadedOutline) {
        setOutline(preloadedOutline);
        setIsLocalLoading(false);
        return preloadedOutline;
      }
      const response = await fetch(`/api/outline/${outlineId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch outline: ${response.status}`);
      }
      const data = await response.json();
      setOutline(data);
      setIsLocalLoading(false);
      return data;
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    if (outlineId) {
      try {
        const response = await fetch(`/api/outline/${outlineId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ outline }),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error saving outline:', error);
      } finally {
        setIsSaving(false);
      }
    }
    if (!outlineId) {
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
        router.push(`/overview`);
      } catch (error) {
        console.error('Error saving outline:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <Carousel className={cn(`h-full max-w-full`)}>
      <div className={cn(`flex max-h-full flex-col pb-4`)}>
        <CarouselContent>
          <CarouselItem className={cn(`basis-full py-4`)}>
            <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 pb-4 sm:px-4`)}>
              <Info isLoading={isLoading || isLocalLoading} />
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
            disabled={isSaving}
            outlined={true}
            className={cn(`absolute bottom-0 right-20 flex items-center gap-2`)}
          >
            <Save className={cn(`size-5`)} />
            {isSaving ? `Saving...` : `Save Outline`}
          </Button>
        </div>
      </div>
    </Carousel>
  );
};

export default Builder;
