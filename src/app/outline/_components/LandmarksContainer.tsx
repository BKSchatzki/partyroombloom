'use client';

import React, { useCallback } from 'react';

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
  newOutlineAtom,
  outlineAtom,
  tutorialOutlineAtom,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';

import Landmarks from './Landmarks';

interface LandmarksProps {
  outlineId: number | null;
  tutorialMode: boolean;
}

const LandmarksContainerComponent: React.FC<LandmarksProps> = ({ outlineId, tutorialMode }) => {
  const [tutorialOutline, setTutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [outline, setOutline] = useAtom(outlineAtom);

  const handleAddLandmark = useCallback(() => {
    if (tutorialMode) {
      setTutorialOutline((outline) => ({
        ...outline,
        elements: [
          ...outline.elements,
          {
            id: v7(),
            parentId: null,
            type: 'landmark',
            name: '',
            description: '',
            rollableSuccess: '',
            rollableFailure: '',
            userCreatedAt: new Date().toISOString(),
          },
        ],
      }));
    } else if (!outlineId) {
      setNewOutline((outline) => ({
        ...outline,
        elements: [
          ...outline.elements,
          {
            id: v7(),
            parentId: null,
            type: 'landmark',
            name: '',
            description: '',
            rollableSuccess: '',
            rollableFailure: '',
            userCreatedAt: new Date().toISOString(),
          },
        ],
      }));
    }
    if (outlineId) {
      setOutline((outline) => ({
        ...outline,
        elements: [
          ...outline.elements,
          {
            id: v7(),
            parentId: null,
            type: 'landmark',
            name: '',
            description: '',
            rollableSuccess: '',
            rollableFailure: '',
            userCreatedAt: new Date().toISOString(),
          },
        ],
      }));
    }
  }, [outlineId, setNewOutline, setOutline, setTutorialOutline, tutorialMode]);

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 sm:px-4`)}>
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
          <Pyramid className={cn(`size-9`)} />
          Landmarks
        </h2>
        <p className={cn(`px-2 text-sm text-base-content/75`)}>
          Landmarks are points of interest in the scene. They can be places, people, objects, etc.,
          and are immediately available to the player characters upon entering the scene.
        </p>
      </section>
      {tutorialMode
        ? tutorialOutline.elements
            .filter((element) => element.type === 'landmark')
            .map((element) => (
              <Landmarks
                key={element.id}
                elementId={element.id}
                outlineId={outlineId}
                tutorialMode={tutorialMode}
              />
            ))
        : outlineId
          ? outline.elements
              .filter((element) => element.type === 'landmark')
              .map((element) => (
                <Landmarks
                  key={element.id}
                  elementId={element.id}
                  outlineId={outlineId}
                  tutorialMode={tutorialMode}
                />
              ))
          : newOutline.elements
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
          <Plus className={cn(`size-5`)} /> Landmark
        </Button>
      </Card>
    </ScrollArea>
  );
};

const LandmarksContainer = React.memo(LandmarksContainerComponent);

LandmarksContainer.displayName = 'LandmarksContainer';

export default LandmarksContainer;
