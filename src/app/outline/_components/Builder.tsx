'use client';

import React, { useState } from 'react';

import { useAtom } from 'jotai';
import { User } from 'lucia';
import {
  ChevronUp,
  Save,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import GenericError from '@/components/GenericError';
import ManageDropdown from '@/components/ManageDropdown';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  existingOutlineAtom,
  newOutlineAtom,
  outlineInit,
  outlinesListAtom,
  tutorialOutlineAtom,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

import TutorialCardComponent from '../tutorial/_components/TutorialCard';
import Info from './Info';
import InteractablesContainer from './InteractablesContainer';
import LandmarksContainer from './LandmarksContainer';
import Review from './Review';
import SecretsContainer from './SecretsContainer';

interface BuilderProps {
  outlineId?: number | null;
  tutorialMode?: boolean;
  user?: User | null;
}

const BuilderComponent: React.FC<BuilderProps> = ({
  outlineId = null,
  tutorialMode = false,
  user = null,
}) => {
  const [tutorialOutline, setTutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [existingOutline, setExistingOutline] = useAtom(existingOutlineAtom);
  const [outlinesList] = useAtom(outlinesListAtom);
  const [isSaving, setIsSaving] = useState(false);
  const [embla, setEmbla] = useState<CarouselApi>();

  const thisOutline = tutorialMode ? tutorialOutline : outlineId ? existingOutline : newOutline;
  const setThisOutline = tutorialMode
    ? setTutorialOutline
    : outlineId
      ? setExistingOutline
      : setNewOutline;

  const router = useRouter();

  const { isLoading, error } = useQuery({
    queryKey: ['outline'],
    queryFn: async () => {
      if (tutorialMode) {
        return tutorialOutline;
      }
      if (!outlineId) {
        return newOutline;
      }
      const preloadedOutline = outlinesList.find((outline) => outline.id === outlineId);
      if (isLoading && preloadedOutline) {
        setExistingOutline(preloadedOutline);
        return preloadedOutline;
      }
      const response = await fetch(`/api/outline/${outlineId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch outline: ${response.status}`);
      }
      const data = await response.json();
      setExistingOutline(data);
      return data;
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    const payload = thisOutline;
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
        setNewOutline(outlineInit);
      } catch (error) {
        console.error('Error saving outline:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (error) {
    return (
      <GenericError
        error={error}
        reset={() => {
          return;
        }}
      />
    );
  }

  return (
    <Carousel
      setApi={setEmbla}
      className={cn(`h-full max-w-full`)}
    >
      <div className={cn(`flex max-h-full select-none flex-col pb-4`)}>
        <CarouselContent>
          <CarouselItem className={cn(`basis-full pb-4`)}>
            <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 sm:px-4`)}>
              {tutorialMode && (
                <TutorialCardComponent
                  builderPage={'info'}
                  embla={embla}
                />
              )}
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
              embla={embla}
            />
          </CarouselItem>
          <CarouselItem className={cn(`basis-full pb-4`)}>
            <InteractablesContainer
              outlineId={outlineId}
              tutorialMode={tutorialMode}
              embla={embla}
            />
          </CarouselItem>
          <CarouselItem className={cn(`basis-full pb-4`)}>
            <SecretsContainer
              outlineId={outlineId}
              tutorialMode={tutorialMode}
              embla={embla}
            />
          </CarouselItem>
          <CarouselItem className={cn(`basis-full pb-4`)}>
            <Review
              outlineId={outlineId}
              tutorialMode={tutorialMode}
              embla={embla}
            />
          </CarouselItem>
        </CarouselContent>
        <div className={cn(`relative h-16 border-t-2 border-[#302a2a]`)}>
          <CarouselPrevious />
          <CarouselNext />
          <div className={cn(`absolute bottom-0 right-20 flex items-center gap-4`)}>
            <ManageDropdown
              outline={thisOutline}
              setOutline={setThisOutline}
              tutorialMode={tutorialMode}
              className={cn(`px-4 py-2 text-sm`)}
            >
              <ChevronUp
                aria-hidden={true}
                className={cn(`size-5`)}
              />
              <span className={cn(`max-sm:hidden`)}>Manage</span>
            </ManageDropdown>
            {user && !tutorialMode && (
              <Button
                onClick={handleSave}
                color={`secondary`}
                disabled={isSaving}
                outlined={true}
              >
                <Save
                  aria-hidden={true}
                  className={cn(`size-5`, isSaving && `animate-spin`)}
                />
                {isSaving ? `Wait` : `Save`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Carousel>
  );
};
const Builder = React.memo(BuilderComponent);
Builder.displayName = 'Builder';
export default Builder;
