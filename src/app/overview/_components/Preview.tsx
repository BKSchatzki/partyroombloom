'use client';

import React from 'react';

import {
  Lock,
  MousePointerClick,
  Pyramid,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

const SecretsPreview = ({ outline, id }: { outline: Outline; id: string }) => {
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
                  `flex items-center gap-2 text-base text-error`,
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
                `relative -m-3 flex flex-col gap-2 bg-warning/10 p-4 shadow-sm shadow-base-100 max-sm:rounded-none`
              )}
            >
              <span
                className={cn(
                  `flex items-center gap-2 text-warning`,
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
                  `flex items-center gap-2 text-warning`,
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

const InteractablesPreview = ({ outline, id }: { outline: Outline; id: string }) => {
  return (
    <div
      className={cn(
        `-mb-7 flex flex-col gap-10 border-t-2 border-base-300 p-4 pb-0 pt-7 has-[div]:mb-0`
      )}
    >
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
                  `flex items-center gap-2 text-lg text-info`,
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
            <SecretsPreview
              outline={outline}
              id={interactable.id}
            />
          </Card>
        ))}
    </div>
  );
};

const LandmarksPreview = ({ outline }: { outline: Outline }) => {
  return (
    <Accordion
      type={`single`}
      collapsible={true}
      className={cn(`flex flex-col gap-4 border-t-2 border-base-300/30 pt-4 sm:px-4`)}
    >
      {outline.elements
        .filter((element) => element.type === 'landmark')
        .map((landmark) => (
          <Card
            key={landmark.id}
            className={cn(
              `relative flex flex-col gap-7 bg-primary/10 p-0 shadow-lg shadow-base-300 max-sm:rounded-none`
            )}
          >
            <AccordionItem value={`${landmark.id}`}>
              <AccordionTrigger
                iconSize={6}
                className={cn(
                  `rounded-2xl outline-none ring-inset ring-primary focus:ring-2 max-sm:rounded-none [&[data-state=open]]:rounded-b-none`
                )}
              >
                <div className={cn(`flex flex-col gap-2 p-4 hover:brightness-125`)}>
                  <span
                    className={cn(
                      `flex items-center gap-2 text-xl text-primary`,
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
                <InteractablesPreview
                  outline={outline}
                  id={landmark.id}
                />
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
    </Accordion>
  );
};

export default LandmarksPreview;
