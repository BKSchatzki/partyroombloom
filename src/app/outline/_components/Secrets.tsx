'use client';

import React, {
  useCallback,
  useMemo,
} from 'react';

import { useAtom } from 'jotai';
import { Plus } from 'lucide-react';
import { v7 } from 'uuid';

import DeleteButton from '@/components/DeleteButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  existingOutlineAtom,
  newOutlineAtom,
  tutorialOutlineAtom,
} from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

import Rollable from './Rollable';

interface SecretsProps {
  elementId: string;
  outlineId: number | null;
  tutorialMode: boolean;
}

const SecretsComponent: React.FC<SecretsProps> = ({ elementId, outlineId, tutorialMode }) => {
  const [tutorialOutline, setTutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [existingOutline, setExistingOutline] = useAtom(existingOutlineAtom);

  const thisOutline = useMemo(
    () => (tutorialMode ? tutorialOutline : outlineId ? existingOutline : newOutline),
    [existingOutline, newOutline, outlineId, tutorialMode, tutorialOutline]
  );
  const thisElement = useMemo(
    () => thisOutline.elements.find((element) => element.id === elementId),
    [elementId, thisOutline.elements]
  );
  const hasElements = useMemo(
    () => thisOutline.elements.filter((element) => element.parentId === thisElement?.id).length > 0,
    [thisElement?.id, thisOutline.elements]
  );

  const handleAddSecret = useCallback(() => {
    if (!thisElement) return;
    const addNewSecret = (outline: Outline): Outline => ({
      ...outline,
      elements: [
        ...outline.elements,
        {
          id: v7(),
          parentId: thisElement.id,
          type: 'secret' as const,
          name: '',
          description: '',
          rollableSuccess: '',
          rollableFailure: '',
          userCreatedAt: new Date().toISOString(),
        },
      ],
    });
    tutorialMode
      ? setTutorialOutline(addNewSecret)
      : outlineId
        ? setExistingOutline(addNewSecret)
        : setNewOutline(addNewSecret);
  }, [outlineId, setNewOutline, setExistingOutline, setTutorialOutline, thisElement, tutorialMode]);

  const handleChange = useCallback(
    (
      id: string,
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      property: string
    ) => {
      if (!id) return;
      const updateSecret = (outline: Outline) => ({
        ...outline,
        elements: outline.elements.map((element) =>
          element.id === id ? { ...element, [property]: event.target.value } : element
        ),
      });
      tutorialMode
        ? setTutorialOutline(updateSecret)
        : outlineId
          ? setExistingOutline(updateSecret)
          : setNewOutline(updateSecret);
    },
    [outlineId, setNewOutline, setExistingOutline, setTutorialOutline, tutorialMode]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) return;
      const deleteSecret = (outline: Outline) => ({
        ...outline,
        elements: outline.elements.filter((element) => element.id !== id),
      });
      tutorialMode
        ? setTutorialOutline(deleteSecret)
        : outlineId
          ? setExistingOutline(deleteSecret)
          : setNewOutline(deleteSecret);
    },
    [outlineId, setNewOutline, setExistingOutline, setTutorialOutline, tutorialMode]
  );

  return (
    <Card
      className={cn(
        `relative mb-8 w-full bg-error/10 shadow-lg shadow-base-300 max-sm:rounded-none`
      )}
    >
      <CardTitle className={cn(`absolute left-4 top-2.5 line-clamp-1 sm:left-8`)}>
        {thisElement?.name || 'Interactable'}
      </CardTitle>
      {thisOutline.elements
        .filter((element) => element.parentId === thisElement?.id && element.type === 'secret')
        .map((element, index) => (
          <div key={element.id}>
            <CardHeader className={cn(`relative pt-7`)}>
              <DeleteButton
                first={index === 0}
                handleDelete={() => handleDelete(element.id)}
                item={element.name || 'this Secret'}
                message="Delete Secret"
              />
              <CardTitle className={cn(`relative`)}>
                <div
                  className={cn(
                    `absolute -top-10 left-1/2 flex -translate-x-1/2 items-center gap-2`
                  )}
                >
                  <span className={cn(`sr-only`)}>Secret</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(`flex flex-col gap-4 max-sm:px-2`)}>
              <Label
                className={cn(`sr-only`)}
                htmlFor={`name-${element.id}`}
              >
                Secret Name
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
                Secret Description
              </Label>
              <Textarea
                className={cn(`no-scrollbar`)}
                id={`description-${element.id}`}
                onChange={(event) => handleChange(element.id, event, 'description')}
                placeholder={`Description`}
                value={element.description}
              />
              <div className={cn(`max-sm:mx-[-0.5rem]`)}>
                <Rollable
                  elementId={element.id}
                  outlineId={thisOutline.id}
                  tutorialMode={tutorialMode}
                />
              </div>
            </CardContent>
            <Separator className={cn(`my-2 mb-0`)} />
          </div>
        ))}
      <CardFooter className={cn(`mt-5 flex flex-col items-start gap-4`)}>
        <Card
          className={cn(
            `mx-auto mb-2 w-[99%] rounded-full bg-error/10 shadow-xl shadow-base-300`,
            !hasElements && `mt-6`
          )}
        >
          <Button
            color={`ghost`}
            onClick={handleAddSecret}
            size={`block`}
          >
            <Plus
              aria-hidden={true}
              className={cn(`size-5`)}
            />{' '}
            Secret
          </Button>
        </Card>
      </CardFooter>
    </Card>
  );
};
const Secrets = React.memo(SecretsComponent);
Secrets.displayName = 'Secrets';
export default Secrets;
