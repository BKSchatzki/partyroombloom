'use client';

import React, { useCallback } from 'react';

import { useAtom } from 'jotai';
import { Plus } from 'lucide-react';
import { v7 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  newOutlineAtom,
  outlineAtom,
  tutorialOutlineAtom,
} from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

import DeleteButton from '../../../components/DeleteButton';

interface InteractablesProps {
  elementId: string;
  outlineId: number | null;
  tutorialMode: boolean;
}

const InteractablesComponent: React.FC<InteractablesProps> = ({
  elementId,
  outlineId,
  tutorialMode,
}) => {
  const [tutorialOutline, setTutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [outline, setOutline] = useAtom(outlineAtom);

  const thisOutline = tutorialMode ? tutorialOutline : outlineId ? outline : newOutline;
  const thisElement = thisOutline.elements.find((element) => element.id === elementId);
  const hasElements =
    thisOutline.elements.filter((element) => element.parentId === thisElement?.id).length > 0;

  const handleAddInteractable = useCallback(() => {
    if (!thisElement) return;
    const addNewInteractable = (outline: Outline): Outline => ({
      ...outline,
      elements: [
        ...outline.elements,
        {
          id: v7(),
          parentId: thisElement.id,
          type: 'interactable' as const,
          name: '',
          description: '',
          rollableSuccess: '',
          rollableFailure: '',
          userCreatedAt: new Date().toISOString(),
        },
      ],
    });
    tutorialMode
      ? setTutorialOutline(addNewInteractable)
      : outlineId
        ? setOutline(addNewInteractable)
        : setNewOutline(addNewInteractable);
  }, [outlineId, setNewOutline, setOutline, setTutorialOutline, thisElement, tutorialMode]);

  const handleChange = useCallback(
    (
      id: string,
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      property: string
    ) => {
      if (!id) return;
      const updateInteractable = (outline: Outline) => ({
        ...outline,
        elements: outline.elements.map((element) =>
          element.id === id ? { ...element, [property]: event.target.value } : element
        ),
      });
      tutorialMode
        ? setTutorialOutline(updateInteractable)
        : outlineId
          ? setOutline(updateInteractable)
          : setNewOutline(updateInteractable);
    },
    [outlineId, setNewOutline, setOutline, setTutorialOutline, tutorialMode]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) return;
      const deleteInteractable = (outline: Outline) => ({
        ...outline,
        elements: outline.elements.filter(
          (element) => element.id !== id && element.parentId !== id
        ),
      });
      tutorialMode
        ? setTutorialOutline(deleteInteractable)
        : outlineId
          ? setOutline(deleteInteractable)
          : setNewOutline(deleteInteractable);
    },
    [outlineId, setNewOutline, setOutline, setTutorialOutline, tutorialMode]
  );

  return (
    <Card
      className={cn(
        `relative mb-8 w-full bg-info/10 shadow-lg shadow-base-300 max-sm:rounded-none`
      )}
    >
      <CardTitle className={cn(`absolute left-4 top-2.5 line-clamp-1 sm:left-8`)}>
        {thisElement?.name || 'Landmark'}
      </CardTitle>
      {thisOutline.elements
        .filter(
          (element) => element.parentId === thisElement?.id && element.type === 'interactable'
        )
        .map((element, index) => (
          <div key={element.id}>
            <CardHeader className={cn(`relative pt-7`)}>
              <DeleteButton
                first={index === 0}
                handleDelete={() => handleDelete(element.id)}
                item={element.name || 'this Interactable'}
                message="Delete Interactable"
              />
              <CardTitle className={cn(`relative`)}>
                <div
                  className={cn(
                    `absolute -top-10 left-1/2 flex -translate-x-1/2 items-center gap-2`
                  )}
                >
                  <span className={cn(`sr-only`)}>Interactable</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(`flex flex-col gap-4 max-sm:px-2`)}>
              <Label
                className={cn(`sr-only`)}
                htmlFor={`name-${element.id}`}
              >
                Interactable Name
              </Label>
              <Input
                className={cn(`w-full`)}
                id={`name-${element.id}`}
                onChange={(event) => handleChange(element.id, event, 'name')}
                placeholder={`Name`}
                value={element.name}
              />
              <Label
                className={cn(`sr-only`)}
                htmlFor={`description-${element.id}`}
              >
                Interactable Description
              </Label>
              <Textarea
                className={cn(`no-scrollbar`)}
                id={`description-${element.id}`}
                onChange={(event) => handleChange(element.id, event, 'description')}
                placeholder={`Description`}
                value={element.description}
              />
            </CardContent>
            <Separator className={cn(`my-2 mb-0`)} />
          </div>
        ))}
      <CardFooter className={cn(`mt-5 flex flex-col items-start gap-4`)}>
        <Card
          className={cn(
            `mx-auto mb-2 w-[99%] rounded-full bg-info/10 shadow-xl shadow-base-300`,
            !hasElements && `mt-6`
          )}
        >
          <Button
            color={`ghost`}
            onClick={handleAddInteractable}
            size={`block`}
          >
            <Plus
              aria-hidden={true}
              className={cn(`size-5`)}
            />{' '}
            Interactable
          </Button>
        </Card>
      </CardFooter>
    </Card>
  );
};

const Interactables = React.memo(InteractablesComponent);

InteractablesComponent.displayName = 'InteractablesComponent';

export default Interactables;
