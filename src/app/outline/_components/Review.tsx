'use client';

import React from 'react';

import { useAtomValue } from 'jotai';
import { Lock, MousePointerClick, Pyramid, Theater, ThumbsDown, ThumbsUp } from 'lucide-react';

import { Card } from '@/components/ui/card';
import type { CarouselApi } from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { outlineTreeAtomFamily } from '@/lib/atoms';
import { getOutlineMode } from '@/lib/outlineState';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

import TutorialCardComponent from '../tutorial/_components/TutorialCard';

interface OutlineProps {
  outline: Outline;
}

interface OutlineIdProps {
  outlineId: number | null;
  tutorialMode: boolean;
  embla?: CarouselApi;
}

const SecretsReviewComponent: React.FC<{
  secrets: Outline['elements'][number]['children'][number]['children'];
}> = ({ secrets }) => {
  return (
    <div className={cn(`-mb-7 flex flex-col gap-8 has-[div]:mb-0`)}>
      {secrets.map((secret) => (
        <Card
          key={secret.id}
          className={cn(
            `bg-error/10 shadow-base-100 relative -m-3 flex flex-col gap-7 p-4 shadow-md max-sm:rounded-none`
          )}
        >
          <div className={cn(`flex flex-col gap-2`)}>
            <span
              className={cn(
                `text-error flex items-center gap-2 text-lg`,
                !secret.name && `italic opacity-30`
              )}
            >
              <Lock className={cn(`size-5`)} />
              {secret.name || 'Untitled Secret'}
            </span>
            <span className={cn(!secret.description && `italic opacity-30`)}>
              {secret.description || 'Information that must be earned with a roll.'}
            </span>
          </div>
          <Card
            className={cn(
              `bg-warning/10 shadow-base-100 relative -m-3 flex flex-col gap-2 p-4 shadow-sm max-sm:rounded-none`
            )}
          >
            <span
              className={cn(
                `text-warning flex items-center gap-2`,
                !secret.rollableSuccess && `italic opacity-30`
              )}
            >
              <ThumbsUp className={cn(`size-4`)} />
              Success
            </span>
            <span className={cn(!secret.rollableSuccess && `italic opacity-30`)}>
              {secret.rollableSuccess || 'Outcome of a successful roll.'}
            </span>
            <span
              className={cn(
                `text-warning flex items-center gap-2`,
                !secret.rollableFailure && `italic opacity-30`
              )}
            >
              <ThumbsDown className={cn(`size-4`)} />
              Failure
            </span>
            <span className={cn(!secret.rollableFailure && `italic opacity-30`)}>
              {secret.rollableFailure || 'Outcome of a failed roll.'}
            </span>
          </Card>
        </Card>
      ))}
    </div>
  );
};

const SecretsReview = React.memo(SecretsReviewComponent);

SecretsReview.displayName = 'SecretsReview';

const InteractablesReviewComponent: React.FC<{
  interactables: Outline['elements'][number]['children'];
}> = ({ interactables }) => {
  return (
    <div className={cn(`-mb-7 flex flex-col gap-10 has-[div]:mb-0`)}>
      {interactables.map((interactable) => (
        <Card
          key={interactable.id}
          className={cn(
            `bg-info/10 shadow-base-200 relative -m-3 flex flex-col gap-7 p-4 shadow-lg max-sm:rounded-none`
          )}
        >
          <div className={cn(`flex flex-col gap-2`)}>
            <span
              className={cn(
                `text-info flex items-center gap-2 text-xl`,
                !interactable.name && `italic opacity-30`
              )}
            >
              <MousePointerClick className={cn(`size-6`)} />
              {interactable.name || 'Untitled Interactable'}
            </span>
            <span className={cn(!interactable.description && `italic opacity-30`)}>
              {interactable.description || 'What is noticed when inspected more closely.'}
            </span>
          </div>
          <SecretsReview secrets={interactable.children} />
        </Card>
      ))}
    </div>
  );
};

const InteractablesReview = React.memo(InteractablesReviewComponent);

InteractablesReview.displayName = 'InteractablesReview';

const LandmarksReviewComponent: React.FC<OutlineProps> = ({ outline }: { outline: Outline }) => {
  return (
    <div className={cn(`mb-8 flex flex-col gap-6`)}>
      {outline.elements.map((landmark) => (
        <Card
          className={cn(
            `bg-primary/10 shadow-base-300 relative flex flex-col gap-7 p-4 shadow-xl max-sm:rounded-none`
          )}
          key={landmark.id}
        >
          <div className={cn(`flex flex-col gap-2`)}>
            <span
              className={cn(
                `text-primary flex items-center gap-2 text-2xl`,
                !landmark.name && `italic opacity-30`
              )}
            >
              <Pyramid className={cn(`size-7`)} />
              {landmark.name || 'Untitled Landmark'}
            </span>
            <span className={cn(!landmark.description && `italic opacity-30`)}>
              {landmark.description || 'The first-glance impression of the landmark.'}
            </span>
          </div>
          <InteractablesReview interactables={landmark.children} />
        </Card>
      ))}
    </div>
  );
};

const LandmarksReview = React.memo(LandmarksReviewComponent);

LandmarksReview.displayName = 'LandmarksReview';

const InfoReviewComponent: React.FC<OutlineProps> = ({ outline }: { outline: Outline }) => {
  return (
    <Card
      className={cn(
        `bg-neutral/50 shadow-base-300 mt-4 mb-4 flex flex-col gap-2 p-4 shadow-xl max-sm:rounded-none`
      )}
    >
      <span
        className={cn(
          `flex w-full shrink-0 items-center gap-2 px-2 text-3xl text-[#64d8b4] max-sm:flex-col sm:basis-1/3 sm:gap-4`,
          !outline.title && `italic opacity-30`
        )}
      >
        <Theater className={cn(`size-9`)} />
        {outline.title || 'Untitled Scene'}
      </span>
      <Separator className={cn(`border-base-300 my-0`)} />
      <span className={cn(!outline.description && `italic opacity-30`)}>
        <span className={cn(`font-semibold text-[#64d8b4]`)}>Description: </span>
        {outline.description || 'A short description to set the scene.'}
      </span>
      <span className={cn(!outline.goal && `italic opacity-30`)}>
        <span className={cn(`font-semibold text-[#64d8b4]`)}>Goal: </span>
        {outline.goal || 'What this scene does or where it leads.'}
      </span>
      <span className={cn(!outline.comments && `italic opacity-30`)}>
        <span className={cn(`font-semibold text-[#64d8b4]`)}>Comments: </span>
        {outline.comments || 'Extra information to help the Simulator or Future You.'}
      </span>
    </Card>
  );
};

const InfoReview = React.memo(InfoReviewComponent);

InfoReview.displayName = 'InfoReview';

const ReviewComponent: React.FC<OutlineIdProps> = ({ outlineId, tutorialMode, embla }) => {
  const mode = getOutlineMode(tutorialMode, outlineId);
  const outline = useAtomValue(outlineTreeAtomFamily(mode));

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 sm:px-4`)}>
      {tutorialMode && (
        <TutorialCardComponent
          builderPage={'review'}
          embla={embla}
        />
      )}
      <InfoReview outline={outline}></InfoReview>
      <LandmarksReview outline={outline}></LandmarksReview>
    </ScrollArea>
  );
};
const Review = React.memo(ReviewComponent);
Review.displayName = 'Review';
export default Review;
