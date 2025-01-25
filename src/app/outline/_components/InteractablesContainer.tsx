'use client';

import React from 'react';

import { useAtom } from 'jotai';
import { MousePointerClick } from 'lucide-react';

import {
  Card,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  existingOutlineAtom,
  newOutlineAtom,
  tutorialOutlineAtom,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';

import Tutorial from '../tutorial/_components/Tutorial';
import Interactables from './Interactables';

interface InteractablesContainerProps {
  outlineId: number | null;
  tutorialMode: boolean;
  embla: any;
}

const InteractablesContainerComponent: React.FC<InteractablesContainerProps> = ({
  outlineId,
  tutorialMode,
  embla,
}) => {
  const [tutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline] = useAtom(newOutlineAtom);
  const [existingOutline] = useAtom(existingOutlineAtom);

  const thisOutline = tutorialMode ? tutorialOutline : outlineId ? existingOutline : newOutline;
  const landmarks = thisOutline.elements.filter((element) => element.type === 'landmark');

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 sm:px-4`)}>
      {tutorialMode && (
        <Tutorial
          builderPage={'interactables'}
          embla={embla}
        />
      )}
      {!tutorialMode && (
        <section
          className={cn(
            `my-8 flex items-center justify-center gap-4 text-info max-sm:flex-col sm:gap-2`
          )}
        >
          <h2
            className={cn(
              `flex w-full shrink-0 items-center gap-2 px-2 text-3xl sm:basis-1/3 sm:justify-center`
            )}
          >
            <MousePointerClick className={cn(`size-9`)} />
            Interactables
          </h2>
          <p className={cn(`px-2 text-sm text-base-content/75`)}>
            Interactables are aspects of landmarks the player characters can interact with. They are
            revealed only when the player characters interact with their associated landmark.
          </p>
        </section>
      )}
      {landmarks.length === 0 ? (
        <Card
          className={cn(
            `mb-8 flex h-[7.5rem] w-full flex-col items-center justify-center bg-info/5 shadow-lg shadow-base-300`
          )}
        >
          <CardTitle>No landmarks found</CardTitle>
          <CardDescription className={cn(`text-base-content/75`)}>
            Interactables need landmarks.
          </CardDescription>
        </Card>
      ) : (
        landmarks.map((element) => (
          <Interactables
            key={element.id}
            elementId={element.id}
            outlineId={outlineId}
            tutorialMode={tutorialMode}
          />
        ))
      )}
    </ScrollArea>
  );
};

const InteractablesContainer = React.memo(InteractablesContainerComponent);

InteractablesContainer.displayName = 'InteractablesContainer';

export default InteractablesContainer;
