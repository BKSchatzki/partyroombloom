'use client';

import React, {
  useCallback,
  useMemo,
} from 'react';

import { useAtom } from 'jotai';
import {
  Plus,
  Pyramid,
} from 'lucide-react';
import { v7 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  existingOutlineAtom,
  newOutlineAtom,
  tutorialOutlineAtom,
} from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

import TutorialCardComponent from '../tutorial/_components/TutorialCard';
import Landmarks from './Landmarks';

interface LandmarksProps {
  outlineId: number | null;
  tutorialMode: boolean;
  embla: any;
}

const LandmarksContainerComponent: React.FC<LandmarksProps> = ({
  outlineId,
  tutorialMode,
  embla,
}) => {
  const [tutorialOutline, setTutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [existingOutline, setExistingOutline] = useAtom(existingOutlineAtom);

  const thisOutline = useMemo(
    () => (tutorialMode ? tutorialOutline : outlineId ? existingOutline : newOutline),
    [existingOutline, newOutline, outlineId, tutorialMode, tutorialOutline]
  );

  const handleAddLandmark = useCallback(() => {
    const addNewLandmark = (outline: Outline): Outline => ({
      ...outline,
      elements: [
        ...outline.elements,
        {
          id: v7(),
          parentId: null,
          type: 'landmark' as const,
          name: '',
          description: '',
          rollableSuccess: '',
          rollableFailure: '',
          userCreatedAt: new Date().toISOString(),
        },
      ],
    });
    tutorialMode
      ? setTutorialOutline(addNewLandmark)
      : outlineId
        ? setExistingOutline(addNewLandmark)
        : setNewOutline(addNewLandmark);
  }, [outlineId, setNewOutline, setExistingOutline, setTutorialOutline, tutorialMode]);

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 sm:px-4`)}>
      {tutorialMode && (
        <TutorialCardComponent
          builderPage={'landmarks'}
          embla={embla}
        />
      )}
      {!tutorialMode && (
        <section
          className={cn(
            `my-8 flex items-center justify-center gap-4 text-primary max-sm:flex-col sm:gap-2`
          )}
        >
          <h2
            className={cn(
              `flex w-full shrink-0 items-center gap-2 px-2 text-3xl sm:basis-1/3 sm:justify-center`
            )}
          >
            {' '}
            <Pyramid
              aria-hidden={true}
              className={cn(`size-9`)}
            />
            Landmarks
          </h2>
          <p className={cn(`px-2 text-sm text-base-content/75`)}>
            Landmarks are points of interest in the scene. They can be places, people, objects,
            etc., and are immediately available to the player characters upon entering the scene.
          </p>
        </section>
      )}
      {thisOutline.elements
        .filter((element) => element.type === 'landmark')
        .map((element) => (
          <Landmarks
            key={element.id}
            elementId={element.id}
            outlineId={outlineId}
            tutorialMode={tutorialMode}
          />
        ))}
      <Card
        className={cn(
          `mx-auto mb-4 w-[99%] rounded-full bg-primary/10 shadow-xl shadow-base-300 max-sm:w-11/12`
        )}
      >
        <Button
          color={`ghost`}
          onClick={handleAddLandmark}
          size={`block`}
        >
          <Plus
            aria-hidden={true}
            className={cn(`size-5`)}
          />{' '}
          Landmark
        </Button>
      </Card>
    </ScrollArea>
  );
};
const LandmarksContainer = React.memo(LandmarksContainerComponent);
LandmarksContainer.displayName = 'LandmarksContainer';
export default LandmarksContainer;
