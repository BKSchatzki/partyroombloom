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
import { outlineAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';

const SecretsReview = (props) => {
  return (
    <div className={cn(`-mb-7 flex flex-col gap-8 has-[div]:mb-0`)}>
      {props.elements
        .filter((element) => element.parentId === props.id && element.type === 'secret')
        .map((secret) => (
          <Card
            key={secret.id}
            className={cn(
              `relative -m-3 flex flex-col gap-7 bg-error/10 p-4 shadow-md shadow-base-100`
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
            {/* Rollables */}
            <Card
              className={cn(
                `relative -m-3 flex flex-col gap-2 bg-warning/10 p-4 shadow-sm shadow-base-100`
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

const InteractablesReview = (props) => {
  return (
    <div className={cn(`-mb-7 flex flex-col gap-10 has-[div]:mb-0`)}>
      {props.outline.elements
        .filter((element) => element.parentId === props.id && element.type === 'interactable')
        .map((interactable) => (
          <Card
            key={interactable.id}
            className={cn(
              `relative -m-3 flex flex-col gap-7 bg-info/10 p-4 shadow-lg shadow-base-200`
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
              elements={props.outline.elements}
              id={interactable.id}
            />
          </Card>
        ))}
    </div>
  );
};

const LandmarksReview = (props) => {
  return (
    <div className={cn(`flex flex-col gap-6`)}>
      {/* Landmarks */}
      {props.outline.elements
        .filter((element) => element.type === 'landmark')
        .map((landmark) => (
          <Card
            className={cn(
              `relative flex flex-col gap-7 bg-primary/10 p-4 shadow-xl shadow-base-300`
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
            {/* Interactables */}
            <InteractablesReview
              outline={props.outline}
              id={landmark.id}
            />
          </Card>
        ))}
    </div>
  );
};

const InfoReview = (props) => {
  return (
    <Card className={cn(`mb-6 flex flex-col gap-2 bg-neutral/50 p-4 shadow-xl shadow-base-300`)}>
      <span
        className={cn(
          `flex w-full shrink-0 items-center gap-2 px-2 text-3xl text-[#64d8b4] max-sm:flex-col sm:basis-1/3 sm:gap-4`,
          !props.info.title && `italic opacity-30`
        )}
      >
        <Theater className={cn(`size-9`)} />
        {props.info.title || 'Untitled Scene'}
      </span>
      <Separator className={cn(`my-0 border-base-300`)} />
      <span className={cn(!props.info.description && `italic opacity-30`)}>
        <span className={cn(`font-semibold text-[#64d8b4]`)}>Description: </span>
        {props.info.description || 'A short description to set the scene.'}
      </span>
      <span className={cn(!props.info.goal && `italic opacity-30`)}>
        <span className={cn(`font-semibold text-[#64d8b4]`)}>Goal: </span>
        {props.info.goal || 'What this scene does or where it leads.'}
      </span>
      <span className={cn(!props.info.comments && `italic opacity-30`)}>
        <span className={cn(`font-semibold text-[#64d8b4]`)}>Comments: </span>
        {props.info.comments || 'Extra information to help the Simulator or Future You.'}
      </span>
    </Card>
  );
};

const Review = () => {
  const [outline] = useAtom(outlineAtom);

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 px-4 pb-4`)}>
      <InfoReview info={outline.info}></InfoReview>
      <LandmarksReview outline={outline}></LandmarksReview>
    </ScrollArea>
  );
};

export default Review;
