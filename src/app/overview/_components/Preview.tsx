'use client';

import React from 'react';

import { Lock, MousePointerClick, Pyramid, ThumbsDown, ThumbsUp } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

const SecretsPreview = ({
  secrets,
}: {
  secrets: Outline['elements'][number]['children'][number]['children'];
}) => {
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
                `text-error flex items-center gap-2 text-base`,
                !secret.name && `italic opacity-30`
              )}
            >
              <Lock
                aria-hidden={true}
                className={cn(`size-4`)}
              />
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
              <ThumbsUp
                aria-hidden={true}
                className={cn(`size-3`)}
              />
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
              <ThumbsDown
                aria-hidden={true}
                className={cn(`size-3`)}
              />
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
const MemoizedSecretsPreview = React.memo(SecretsPreview);
MemoizedSecretsPreview.displayName = 'SecretsPreview';

const InteractablesPreview = ({
  interactables,
}: {
  interactables: Outline['elements'][number]['children'];
}) => {
  return (
    <div
      className={cn(
        `border-base-300 -mb-7 flex flex-col gap-10 border-t-2 p-4 pt-7 pb-0 has-[div]:mb-0`
      )}
    >
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
                `text-info flex items-center gap-2 text-lg`,
                !interactable.name && `italic opacity-30`
              )}
            >
              <MousePointerClick
                aria-hidden={true}
                className={cn(`size-5`)}
              />
              {interactable.name || 'Untitled Interactable'}
            </span>
            <span className={cn(!interactable.description && `italic opacity-30`)}>
              {interactable.description || 'What is noticed when inspected more closely.'}
            </span>
          </div>
          <MemoizedSecretsPreview secrets={interactable.children} />
        </Card>
      ))}
    </div>
  );
};
const MemoizedInteractablesPreview = React.memo(InteractablesPreview);
MemoizedInteractablesPreview.displayName = 'InteractablesPreview';

const LandmarksPreview = ({ outline }: { outline: Outline }) => {
  return (
    <Accordion
      type={`single`}
      collapsible={true}
      className={cn(`border-base-300/30 flex flex-col gap-4 border-t-2 pt-4 sm:px-4`)}
    >
      {outline.elements.map((landmark) => (
        <Card
          key={landmark.id}
          className={cn(
            `bg-primary/10 shadow-base-300 relative flex flex-col gap-7 p-0 shadow-lg max-sm:rounded-none`
          )}
        >
          <AccordionItem value={`${landmark.id}`}>
            <AccordionTrigger
              iconSize={6}
              className={cn(
                `ring-primary rounded-2xl outline-none ring-inset focus:ring-2 data-[state=open]:rounded-b-none max-sm:rounded-none`
              )}
            >
              <div className={cn(`flex flex-col gap-2 p-4 hover:brightness-125`)}>
                <span
                  className={cn(
                    `text-primary flex items-center gap-2 text-xl`,
                    !landmark.name && `italic opacity-30`
                  )}
                >
                  <Pyramid
                    aria-hidden={true}
                    className={cn(`size-6`)}
                  />
                  {landmark.name || 'Untitled Landmark'}
                </span>
                <span className={cn(!landmark.description && `italic opacity-30`)}>
                  {landmark.description || 'The first-glance impression of the landmark.'}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <MemoizedInteractablesPreview interactables={landmark.children} />
            </AccordionContent>
          </AccordionItem>
        </Card>
      ))}
    </Accordion>
  );
};
const MemoizedLandmarksPreview = React.memo(LandmarksPreview);
MemoizedLandmarksPreview.displayName = 'LandmarksPreview';

export default MemoizedLandmarksPreview;
