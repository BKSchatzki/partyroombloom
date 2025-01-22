'use client';

import React, { useState } from 'react';

import { useAtom } from 'jotai';
import {
  ChevronUp,
  Save,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import BackupsDropdown from '@/app/overview/_components/BackupsDropdown';
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
  newOutlineAtom,
  outlineAtom,
  outlineInit,
  outlinesListAtom,
  tutorialOutlineAtom,
  tutorialOutlineInit,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

import Info from './Info';
import InteractablesContainer from './InteractablesContainer';
import LandmarksContainer from './LandmarksContainer';
import Review from './Review';
import SecretsContainer from './SecretsContainer';

interface BuilderProps {
  outlineId: number | null;
  tutorialMode: boolean;
}

const BuilderComponent: React.FC<BuilderProps> = ({ outlineId, tutorialMode = false }) => {
  const [tutorialOutline, setTutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [outline, setOutline] = useAtom(outlineAtom);
  const [outlinesList] = useAtom(outlinesListAtom);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const { isLoading, error } = useQuery({
    queryKey: ['outline'],
    queryFn: async () => {
      if (tutorialMode) {
        setTutorialOutline(tutorialOutlineInit);
        return tutorialOutline;
      }
      if (!outlineId) {
        return newOutline;
      }
      const preloadedOutline = outlinesList.find((outline) => outline.id === outlineId);
      if (preloadedOutline) {
        setOutline(preloadedOutline);
        return preloadedOutline;
      }
      const response = await fetch(`/api/outline/${outlineId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch outline: ${response.status}`);
      }
      const data = await response.json();
      setOutline(data);
      return data;
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    const payload = outlineId ? outline : newOutline;
    if (outlineId) {
      try {
        const response = await fetch(`/api/outline/${outlineId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payload }),
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
          body: JSON.stringify({ payload }),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        router.push(`/overview`);
      } catch (error) {
        console.error('Error saving outline:', error);
      } finally {
        setIsSaving(false);
        setNewOutline(outlineInit);
      }
    }
  };

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <Carousel className={cn(`h-full max-w-full`)}>
      <div className={cn(`flex max-h-full select-none flex-col pb-4`)}>
        <CarouselContent>
          <CarouselItem className={cn(`basis-full pb-4`)}>
            <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 sm:px-4`)}>
              <Info
                outlineId={outlineId}
                tutorialMode={tutorialMode}
              />
            </ScrollArea>
          </CarouselItem>
          <CarouselItem className={cn(`basis-full pb-4`)}>
            <LandmarksContainer
              outlineId={outlineId}
              tutorialMode={tutorialMode}
            />
          </CarouselItem>
          <CarouselItem className={cn(`basis-full pb-4`)}>
            <InteractablesContainer
              outlineId={outlineId}
              tutorialMode={tutorialMode}
            />
          </CarouselItem>
          <CarouselItem className={cn(`basis-full pb-4`)}>
            <SecretsContainer
              outlineId={outlineId}
              tutorialMode={tutorialMode}
            />
          </CarouselItem>
          <CarouselItem className={cn(`basis-full pb-4`)}>
            <Review
              outlineId={outlineId}
              tutorialMode={tutorialMode}
            />
          </CarouselItem>
        </CarouselContent>
        <div className={cn(`relative h-16 border-t-2 border-[#302a2a]`)}>
          <CarouselPrevious />
          <CarouselNext />
          <div className={cn(`absolute bottom-0 right-20 flex items-center gap-4`)}>
            <BackupsDropdown
              outline={outlineId ? outline : newOutline}
              setOutline={outlineId ? null : setNewOutline}
              className={cn(`px-4 py-2 text-sm`)}
            >
              <ChevronUp className={cn(`size-5`)} />
              <span className={cn(`max-sm:hidden`)}>Backup</span>
            </BackupsDropdown>
            <Button
              onClick={handleSave}
              color={`secondary`}
              disabled={isSaving}
              outlined={true}
            >
              <Save className={cn(`size-5`, isSaving && `animate-spin`)} />
              {isSaving ? `Wait` : `Save`}
            </Button>
          </div>
        </div>
      </div>
    </Carousel>
  );
};

const Builder = React.memo(BuilderComponent);

Builder.displayName = 'Builder';

export default Builder;
