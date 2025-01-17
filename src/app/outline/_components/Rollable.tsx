'use client';

import React, { useCallback } from 'react';

import { useAtom } from 'jotai';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  newOutlineAtom,
  outlineAtom,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';

const Rollable = ({ elementId, outlineId }: { elementId: string; outlineId: number | null }) => {
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [outline, setOutline] = useAtom(outlineAtom);

  const thisElement = outlineId
    ? outline.elements.find((element) => element.id === elementId)
    : newOutline.elements.find((element) => element.id === elementId);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>, property: string) => {
      if (!thisElement) return;
      if (!outlineId) {
        setNewOutline((outline) => ({
          ...outline,
          elements: outline.elements.map((element) =>
            element.id === thisElement.id
              ? {
                  ...element,
                  [property]: event.target.value,
                }
              : element
          ),
        }));
      }
      if (outlineId) {
        setOutline((outline) => ({
          ...outline,
          elements: outline.elements.map((element) =>
            element.id === thisElement.id
              ? {
                  ...element,
                  [property]: event.target.value,
                }
              : element
          ),
        }));
      }
    },
    [outlineId, setNewOutline, setOutline, thisElement]
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

export default Rollable;
