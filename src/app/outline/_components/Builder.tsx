'use client';

import React, { useCallback, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import type { ClientUser } from '@/lib/auth';
import { ChevronUp, Save } from 'lucide-react';
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
  outlineTreeAtomFamily,
  outlineInit,
  outlinesListAtom,
  updateOutlineMetaFieldAtomFamily,
} from '@/lib/atoms';
import { getOutlineMode, OutlineMetaField } from '@/lib/outlineState';
import { OutlineTreeSchema } from '@/lib/schemas';
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
  user?: ClientUser | null;
}

const OUTLINE_META_FIELDS: Record<OutlineMetaField, true> = {
  title: true,
  description: true,
  goal: true,
  comments: true,
};

const isOutlineMetaField = (value: string): value is OutlineMetaField => {
  return Object.prototype.hasOwnProperty.call(OUTLINE_META_FIELDS, value);
};

const BuilderComponent: React.FC<BuilderProps> = ({
  outlineId = null,
  tutorialMode = false,
  user = null,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [embla, setEmbla] = useState<CarouselApi>();
  const mode = getOutlineMode(tutorialMode, outlineId);
  const thisOutline = useAtomValue(outlineTreeAtomFamily(mode));
  const setThisOutline = useSetAtom(outlineTreeAtomFamily(mode));
  const updateMetaField = useSetAtom(updateOutlineMetaFieldAtomFamily(mode));
  const outlinesList = useAtomValue(outlinesListAtom);
  const setExistingOutline = useSetAtom(existingOutlineAtom);
  const setNewOutline = useSetAtom(newOutlineAtom);

  const router = useRouter();

  const { error } = useQuery({
    queryKey: ['outline', outlineId, tutorialMode],
    queryFn: async () => {
      if (tutorialMode) {
        return thisOutline;
      }
      if (!outlineId) {
        return thisOutline;
      }
      const preloadedOutline = outlinesList.find((outline) => outline.id === outlineId);
      if (preloadedOutline) {
        setExistingOutline(preloadedOutline);
        return preloadedOutline;
      }
      const response = await fetch(`/api/outline/${outlineId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch outline: ${response.status}`);
      }
      const parsedOutline = OutlineTreeSchema.safeParse(await response.json());
      if (!parsedOutline.success) {
        throw new Error('Invalid outline payload');
      }
      setExistingOutline(parsedOutline.data);
      return parsedOutline.data;
    },
  });

  const handleInfoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, property: string) => {
      if (!isOutlineMetaField(property)) {
        return;
      }
      updateMetaField({ field: property, value: event.target.value });
    },
    [updateMetaField]
  );

  const handleSave = useCallback(async () => {
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
  }, [outlineId, router, setNewOutline, thisOutline]);

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
      <div className={cn(`flex max-h-full min-h-0 flex-col pb-4 select-none`)}>
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
                title={thisOutline.title}
                description={thisOutline.description}
                goal={thisOutline.goal}
                comments={thisOutline.comments}
                handleChange={handleInfoChange}
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
        <div className={cn(`relative h-16 shrink-0 border-t-2 border-[#302a2a]`)}>
          <CarouselPrevious />
          <CarouselNext />
          <div className={cn(`absolute inset-y-0 right-20 flex items-center gap-4`)}>
            <ManageDropdown
              outline={thisOutline}
              setOutline={setThisOutline}
              tutorialMode={tutorialMode}
              className={cn(`w-auto px-4 text-sm sm:col-auto`)}
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
                className={cn(`h-10 min-h-10 px-4 text-sm`)}
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
