'use client';

import React from 'react';

import { useAtom } from 'jotai';
import {
  Lock,
  MousePointerClick,
  Pyramid,
  Theater,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  newOutlineAtom,
  outlineAtom,
} from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

interface OutlineProps {
  outline: Outline;
}

interface OutlineAndIdProps extends OutlineProps {
  id: string;
}

interface OutlineIdProps {
  outlineId: number | null;
}

const SecretsReviewComponent: React.FC<OutlineAndIdProps> = ({ outline, id }) => {
  return (
    <div className={cn(`-mb-7 flex flex-col gap-8 has-[div]:mb-0`)}>
      {outline.elements
        .filter((element) => element.parentId === id && element.type === 'secret')
        .map((secret) => (
          <Card
            key={secret.id}
            className={cn(
              `relative -m-3 flex flex-col gap-7 bg-error/10 p-4 shadow-md shadow-base-100 max-sm:rounded-none`
            )}
          >
            <div className={cn(`flex flex-col gap-2`)}>
              <span
                className={cn(
                  `flex items-center gap-2 text-lg text-error`,
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
                `relative -m-3 flex flex-col gap-2 bg-warning/10 p-4 shadow-sm shadow-base-100 max-sm:rounded-none`
              )}
            >
              <span
                className={cn(
                  `flex items-center gap-2 text-warning`,
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
                  `flex items-center gap-2 text-warning`,
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

const InteractablesReviewComponent: React.FC<OutlineAndIdProps> = ({
  outline,
  id,
}: {
  outline: Outline;
  id: string;
}) => {
  return (
    <div className={cn(`-mb-7 flex flex-col gap-10 has-[div]:mb-0`)}>
      {outline.elements
        .filter((element) => element.parentId === id && element.type === 'interactable')
        .map((interactable) => (
          <Card
            key={interactable.id}
            className={cn(
              `relative -m-3 flex flex-col gap-7 bg-info/10 p-4 shadow-lg shadow-base-200 max-sm:rounded-none`
            )}
          >
            <div className={cn(`flex flex-col gap-2`)}>
              <span
                className={cn(
                  `flex items-center gap-2 text-xl text-info`,
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
            <SecretsReview
              outline={outline}
              id={interactable.id}
            />
          </Card>
        ))}
    </div>
  );
};

const InteractablesReview = React.memo(InteractablesReviewComponent);

InteractablesReview.displayName = 'InteractablesReview';

const LandmarksReviewComponent: React.FC<OutlineProps> = ({ outline }: { outline: Outline }) => {
  return (
    <div className={cn(`flex flex-col gap-6`)}>
      {outline.elements
        .filter((element) => element.type === 'landmark')
        .map((landmark) => (
          <Card
            className={cn(
              `relative flex flex-col gap-7 bg-primary/10 p-4 shadow-xl shadow-base-300 max-sm:rounded-none`
            )}
            key={landmark.id}
          >
            <div className={cn(`flex flex-col gap-2`)}>
              <span
                className={cn(
                  `flex items-center gap-2 text-2xl text-primary`,
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
            <InteractablesReview
              outline={outline}
              id={landmark.id}
            />
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
        `mb-6 flex flex-col gap-2 bg-neutral/50 p-4 shadow-xl shadow-base-300 max-sm:rounded-none`
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
      <Separator className={cn(`my-0 border-base-300`)} />
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

const ReviewComponent: React.FC<OutlineIdProps> = ({ outlineId }) => {
  const [newOutline] = useAtom(newOutlineAtom);
  const [outline] = useAtom(outlineAtom);

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 pb-4 sm:px-4`)}>
      <InfoReview outline={outlineId ? outline : newOutline}></InfoReview>
      <LandmarksReview outline={outlineId ? outline : newOutline}></LandmarksReview>
    </ScrollArea>
  );
};

const Review = React.memo(ReviewComponent);

Review.displayName = 'Review';

export default Review;
