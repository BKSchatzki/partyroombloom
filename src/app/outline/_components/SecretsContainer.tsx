'use client';

import React, { useMemo } from 'react';

import { useAtom } from 'jotai';
import { Lock } from 'lucide-react';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  existingOutlineAtom,
  newOutlineAtom,
  tutorialOutlineAtom,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';

import TutorialCardComponent from '../tutorial/_components/TutorialCard';
import Secrets from './Secrets';

interface SecretsContainerProps {
  outlineId: number | null;
  tutorialMode: boolean;
  embla: any;
}

const SecretsContainerComponent: React.FC<SecretsContainerProps> = ({
  outlineId,
  tutorialMode,
  embla,
}) => {
  const [tutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline] = useAtom(newOutlineAtom);
  const [existingOutline] = useAtom(existingOutlineAtom);

  const thisOutline = useMemo(
    () => (tutorialMode ? tutorialOutline : outlineId ? existingOutline : newOutline),
    [existingOutline, newOutline, outlineId, tutorialMode, tutorialOutline]
  );

  const sortedInteractables = useMemo(
    () =>
      thisOutline.elements
        .filter((element) => element.type === 'interactable')
        .sort(
          (a, b) =>
            thisOutline.elements.findIndex((element) => element.id === a.parentId) -
            thisOutline.elements.findIndex((element) => element.id === b.parentId)
        ),
    [thisOutline.elements]
  );

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 sm:px-4`)}>
      {tutorialMode && (
        <TutorialCardComponent
          builderPage={'secrets'}
          embla={embla}
        />
      )}
      {!tutorialMode && (
        <section
          className={cn(
            `my-8 flex items-center justify-center gap-4 text-error max-sm:flex-col sm:gap-2`
          )}
        >
          <h2
            className={cn(
              `flex w-full shrink-0 items-center gap-2 px-2 text-3xl sm:basis-1/3 sm:justify-center`
            )}
          >
            <Lock
              aria-hidden={true}
              className={cn(`size-9`)}
            />
            Secrets
          </h2>
          <p className={cn(`px-2 text-sm text-base-content/75`)}>
            Secrets are hidden elements associated with an interactable that can only be revealed
            through player character deduction or rolls. They can be loot, information, traps, etc.
          </p>
        </section>
      )}
      {sortedInteractables.length === 0 ? (
        <Card
          className={cn(
            `mb-8 flex h-[7.5rem] w-full flex-col items-center justify-center bg-error/5 shadow-lg shadow-base-300`
          )}
        >
          <CardTitle>No interactables found</CardTitle>
          <CardDescription className={cn(`text-base-content/75`)}>
            Secrets need interactables.
          </CardDescription>
        </Card>
      ) : (
        sortedInteractables.map((element) => (
          <Secrets
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
const SecretsContainer = React.memo(SecretsContainerComponent);
SecretsContainer.displayName = 'SecretsContainer';
export default SecretsContainer;
