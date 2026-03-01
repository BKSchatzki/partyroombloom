'use client';

import React, { useCallback } from 'react';

import { useSetAtom } from 'jotai';

import { Card } from '@/components/ui/card';
import { deleteOutlineNodeAtomFamily, updateOutlineNodeFieldAtomFamily } from '@/lib/atoms';
import { getOutlineMode, OutlineNodeField } from '@/lib/outlineState';
import { cn } from '@/lib/utils';

import OutlineNodeItem from './OutlineNodeItem';
import { LANDMARK_ITEM_CONFIG } from './outlineNodeConfig';

interface LandmarkProps {
  elementId: string;
  outlineId: number | null;
  tutorialMode: boolean;
}

const LandmarkComponent: React.FC<LandmarkProps> = ({ elementId, outlineId, tutorialMode }) => {
  const mode = getOutlineMode(tutorialMode, outlineId);
  const updateNodeField = useSetAtom(updateOutlineNodeFieldAtomFamily(mode));
  const deleteNode = useSetAtom(deleteOutlineNodeAtomFamily(mode));

  const handleChange = useCallback(
    (
      nodeId: string,
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      field: OutlineNodeField
    ) => {
      updateNodeField({
        nodeId,
        field,
        value: event.target.value,
      });
    },
    [updateNodeField]
  );

  const handleDelete = useCallback(
    (nodeId: string) => {
      deleteNode(nodeId);
    },
    [deleteNode]
  );

  return (
    <Card className={cn(`mb-8 w-full bg-primary/10 shadow-xl shadow-base-300 max-sm:rounded-none`)}>
      <OutlineNodeItem
        mode={mode}
        nodeId={elementId}
        first={true}
        itemConfig={LANDMARK_ITEM_CONFIG}
        onDelete={handleDelete}
        onChange={handleChange}
      />
    </Card>
  );
};
const Landmark = React.memo(LandmarkComponent);
Landmark.displayName = 'Landmark';
export default Landmark;
