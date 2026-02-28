'use client';

import React, { useCallback } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import DeleteButton from '@/components/DeleteButton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { deleteOutlineNodeAtomFamily, outlineNodeAtomFamily, updateOutlineNodeFieldAtomFamily } from '@/lib/atoms';
import { getOutlineMode, OutlineNodeField } from '@/lib/outlineState';
import { cn } from '@/lib/utils';

interface LandmarkProps {
  elementId: string;
  outlineId: number | null;
  tutorialMode: boolean;
}

const LandmarkComponent: React.FC<LandmarkProps> = ({ elementId, outlineId, tutorialMode }) => {
  const mode = getOutlineMode(tutorialMode, outlineId);
  const scopedNodeId = `${mode}:${elementId}`;
  const thisElement = useAtomValue(outlineNodeAtomFamily(scopedNodeId));
  const updateNodeField = useSetAtom(updateOutlineNodeFieldAtomFamily(mode));
  const deleteNode = useSetAtom(deleteOutlineNodeAtomFamily(mode));

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: OutlineNodeField) => {
      updateNodeField({
        nodeId: elementId,
        field,
        value: event.target.value,
      });
    },
    [elementId, updateNodeField]
  );

  const handleDelete = useCallback(() => {
    deleteNode(elementId);
  }, [deleteNode, elementId]);

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
          value={thisElement?.name ?? ''}
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
          value={thisElement?.description ?? ''}
        />
      </CardContent>
    </Card>
  );
};
const Landmark = React.memo(LandmarkComponent);
Landmark.displayName = 'Landmark';
export default Landmark;
