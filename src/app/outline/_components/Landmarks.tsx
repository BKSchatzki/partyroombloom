'use client';

import React, {
  useCallback,
  useMemo,
} from 'react';

import { useAtom } from 'jotai';

import DeleteButton from '@/components/DeleteButton';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  existingOutlineAtom,
  newOutlineAtom,
  tutorialOutlineAtom,
} from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LandmarksProps {
  elementId: string;
  outlineId: number | null;
  tutorialMode: boolean;
}

const LandmarksComponent: React.FC<LandmarksProps> = ({ elementId, outlineId, tutorialMode }) => {
  const [tutorialOutline, setTutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [existingOutline, setExistingOutline] = useAtom(existingOutlineAtom);

  const thisElement = useMemo(
    () =>
      tutorialMode
        ? tutorialOutline.elements.find((element) => element.id === elementId)
        : outlineId
          ? existingOutline.elements.find((element) => element.id === elementId)
          : newOutline.elements.find((element) => element.id === elementId),
    [
      elementId,
      existingOutline.elements,
      newOutline.elements,
      outlineId,
      tutorialMode,
      tutorialOutline.elements,
    ]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, property: string) => {
      if (!thisElement) return;
      const updateLandmark = (outline: Outline) => ({
        ...outline,
        elements: outline.elements.map((element) =>
          element.id === thisElement.id ? { ...element, [property]: event.target.value } : element
        ),
      });
      tutorialMode
        ? setTutorialOutline(updateLandmark)
        : outlineId
          ? setExistingOutline(updateLandmark)
          : setNewOutline(updateLandmark);
    },
    [outlineId, setNewOutline, setExistingOutline, setTutorialOutline, thisElement, tutorialMode]
  );

  const handleDelete = useCallback(() => {
    if (!thisElement) return;
    const deleteLandmark = (outline: Outline) => {
      const deleteCascade = (parentId: string): string[] => {
        const children = outline.elements
          .filter((element) => element.parentId === parentId)
          .map((element) => element.id);
        const descendants = children.flatMap((childId) => deleteCascade(childId));
        return [...children, ...descendants];
      };
      const elementsToDelete = deleteCascade(thisElement.id);
      const updatedElements = outline.elements.filter(
        (element) => element.id !== thisElement.id && !elementsToDelete.includes(element.id)
      );
      return {
        ...outline,
        elements: updatedElements,
      };
    };
    tutorialMode
      ? setTutorialOutline(deleteLandmark)
      : outlineId
        ? setExistingOutline(deleteLandmark)
        : setNewOutline(deleteLandmark);
  }, [outlineId, setNewOutline, setExistingOutline, setTutorialOutline, thisElement, tutorialMode]);

  return (
    <Card className={cn(`mb-8 w-full bg-primary/10 shadow-xl shadow-base-300 max-sm:rounded-none`)}>
      <CardHeader className={cn(`relative pt-7`)}>
        <DeleteButton
          first={true}
          handleDelete={handleDelete}
          item={thisElement?.name || 'this Landmark'}
          message="Delete Landmark"
        />
      </CardHeader>
      <CardContent className={cn(`flex flex-col gap-4 max-sm:px-2`)}>
        <Label
          className={cn(`sr-only`)}
          htmlFor={`name-${elementId}`}
        >
          Landmark Name
        </Label>
        <Input
          className={cn(`w-full`)}
          id={`name-${elementId}`}
          onChange={(event) => handleChange(event, 'name')}
          placeholder={`Name`}
          value={thisElement?.name}
        />
        <Label
          className={cn(`sr-only`)}
          htmlFor={`description-${elementId}`}
        >
          Landmark Description
        </Label>
        <Textarea
          className={cn(`no-scrollbar`)}
          id={`description-${elementId}`}
          onChange={(event) => handleChange(event, 'description')}
          placeholder={`Description`}
          value={thisElement?.description}
        />
      </CardContent>
    </Card>
  );
};
const Landmarks = React.memo(LandmarksComponent);
Landmarks.displayName = 'Landmarks';
export default Landmarks;
