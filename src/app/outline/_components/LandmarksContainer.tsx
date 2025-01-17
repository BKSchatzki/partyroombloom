'use client';

import React from 'react';

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
} from '@/lib/atoms';
import { cn } from '@/lib/utils';

import Landmarks from './Landmarks';

const LandmarksContainer = ({ outlineId }: { outlineId: number | null }) => {
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [outline, setOutline] = useAtom(outlineAtom);

  const handleAddLandmark = () => {
    if (!outlineId) {
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
  };

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 pb-4 sm:px-4`)}>
      <section
        className={cn(
          `mb-8 mt-4 flex items-center justify-center gap-4 text-primary max-sm:flex-col sm:gap-2`
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
      {outlineId
        ? outline.elements
            .filter((element) => element.type === 'landmark')
            .map((element) => (
              <Landmarks
                key={element.id}
                elementId={element.id}
                outlineId={outlineId}
              />
            ))
        : newOutline.elements
            .filter((element) => element.type === 'landmark')
            .map((element) => (
              <Landmarks
                key={element.id}
                elementId={element.id}
                outlineId={outlineId}
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

export default LandmarksContainer;
