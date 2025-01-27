'use client';

import React, {
  useCallback,
  useMemo,
} from 'react';

import { useAtom } from 'jotai';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  existingOutlineAtom,
  newOutlineAtom,
  tutorialOutlineAtom,
} from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RollableProps {
  elementId: string;
  outlineId: number | null;
  tutorialMode: boolean;
}

const RollableComponent: React.FC<RollableProps> = ({ elementId, outlineId, tutorialMode }) => {
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

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>, property: string) => {
      if (!thisElement) return;
      const updateRollable = (outline: Outline) => ({
        ...outline,
        elements: outline.elements.map((element) =>
          element.id === thisElement.id
            ? {
                ...element,
                [property]: event.target.value,
              }
            : element
        ),
      });
      tutorialMode
        ? setTutorialOutline(updateRollable)
        : outlineId
          ? setExistingOutline(updateRollable)
          : setNewOutline(updateRollable);
    },
    [outlineId, setNewOutline, setExistingOutline, setTutorialOutline, thisElement, tutorialMode]
  );

  return (
    <Card className={cn(`w-full bg-warning/10 shadow-lg shadow-base-200 max-sm:rounded-none`)}>
      <CardContent className={cn(`flex flex-col gap-4 pt-4 max-sm:px-2`)}>
        <Label
          className={cn(`sr-only`)}
          htmlFor={`success-${elementId}`}
        >
          Success
        </Label>
        <Textarea
          className={cn(`no-scrollbar`)}
          id={`success-${elementId}`}
          onChange={(event) => handleChange(event, 'rollableSuccess')}
          placeholder={`Success`}
          value={thisElement?.rollableSuccess}
        />
        <Label
          className={cn(`sr-only`)}
          htmlFor={`failure-${elementId}`}
        >
          Failure
        </Label>
        <Textarea
          className={cn(`no-scrollbar`)}
          id={`failure-${elementId}`}
          onChange={(event) => handleChange(event, 'rollableFailure')}
          placeholder={`Failure`}
          value={thisElement?.rollableFailure}
        />
      </CardContent>
    </Card>
  );
};
const Rollable = React.memo(RollableComponent);
Rollable.displayName = 'Rollable';
export default Rollable;
