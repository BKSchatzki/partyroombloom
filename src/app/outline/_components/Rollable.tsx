'use client';

import React, { useCallback } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { outlineNodeAtomFamily, updateOutlineNodeFieldAtomFamily } from '@/lib/atoms';
import { getOutlineMode } from '@/lib/outlineState';
import { cn } from '@/lib/utils';

interface RollableProps {
  elementId: string;
  outlineId: number | null;
  tutorialMode: boolean;
}

const RollableComponent: React.FC<RollableProps> = ({ elementId, outlineId, tutorialMode }) => {
  const mode = getOutlineMode(tutorialMode, outlineId);
  const thisElement = useAtomValue(outlineNodeAtomFamily(`${mode}:${elementId}`));
  const updateNodeField = useSetAtom(updateOutlineNodeFieldAtomFamily(mode));

  const handleChange = useCallback(
    (
      event: React.ChangeEvent<HTMLTextAreaElement>,
      field: 'rollableSuccess' | 'rollableFailure'
    ) => {
      updateNodeField({
        nodeId: elementId,
        field,
        value: event.target.value,
      });
    },
    [elementId, updateNodeField]
  );

  return (
    <Card className={cn(`bg-warning/10 shadow-base-200 w-full shadow-lg max-sm:rounded-none`)}>
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
          value={thisElement?.rollableSuccess ?? ''}
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
          value={thisElement?.rollableFailure ?? ''}
        />
      </CardContent>
    </Card>
  );
};
const Rollable = React.memo(RollableComponent);
Rollable.displayName = 'Rollable';
export default Rollable;
