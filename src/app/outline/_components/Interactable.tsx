'use client';

import React, { useCallback } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardTitle } from '@/components/ui/card';
import {
  addChildNodeAtomFamily,
  deleteOutlineNodeAtomFamily,
  outlineChildIdsAtomFamily,
  outlineNodeAtomFamily,
  updateOutlineNodeFieldAtomFamily,
} from '@/lib/atoms';
import { getOutlineMode, OutlineNodeField } from '@/lib/outlineState';
import { cn } from '@/lib/utils';
import OutlineNodeItem from './OutlineNodeItem';
import { INTERACTABLE_GROUP_CONFIG, INTERACTABLE_ITEM_CONFIG } from './outlineNodeConfig';

interface InteractableProps {
  elementId: string;
  outlineId: number | null;
  tutorialMode: boolean;
}

const InteractableComponent: React.FC<InteractableProps> = ({
  elementId,
  outlineId,
  tutorialMode,
}) => {
  const mode = getOutlineMode(tutorialMode, outlineId);
  const thisElement = useAtomValue(outlineNodeAtomFamily(`${mode}:${elementId}`));
  const interactableIds = useAtomValue(outlineChildIdsAtomFamily(`${mode}:${elementId}`));
  const addChildNode = useSetAtom(addChildNodeAtomFamily(mode));
  const updateNodeField = useSetAtom(updateOutlineNodeFieldAtomFamily(mode));
  const deleteNode = useSetAtom(deleteOutlineNodeAtomFamily(mode));
  const hasElements = interactableIds.length > 0;

  const handleAddInteractable = useCallback(() => {
    addChildNode({
      parentId: elementId,
      childType: 'interactable',
    });
  }, [addChildNode, elementId]);

  const handleChange = useCallback(
    (
      id: string,
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      field: OutlineNodeField
    ) => {
      updateNodeField({
        nodeId: id,
        field,
        value: event.target.value,
      });
    },
    [updateNodeField]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteNode(id);
    },
    [deleteNode]
  );

  return (
    <Card className={cn(INTERACTABLE_GROUP_CONFIG.cardClassName)}>
      <CardTitle className={cn(INTERACTABLE_GROUP_CONFIG.titleClassName)}>
        {thisElement?.name || INTERACTABLE_GROUP_CONFIG.parentTitleFallback}
      </CardTitle>
      {interactableIds.map((interactableId, index) => (
        <OutlineNodeItem
          key={interactableId}
          nodeId={interactableId}
          mode={mode}
          first={index === 0}
          itemConfig={INTERACTABLE_ITEM_CONFIG}
          onDelete={handleDelete}
          onChange={handleChange}
        />
      ))}
      <CardFooter className={cn(INTERACTABLE_GROUP_CONFIG.footerClassName)}>
        <Card className={cn(INTERACTABLE_GROUP_CONFIG.addCardClassName, !hasElements && `mt-6`)}>
          <Button
            color={`ghost`}
            onClick={handleAddInteractable}
            size={`block`}
          >
            <Plus
              aria-hidden={true}
              className={cn(INTERACTABLE_GROUP_CONFIG.addIconClassName)}
            />{' '}
            {INTERACTABLE_GROUP_CONFIG.addLabel}
          </Button>
        </Card>
      </CardFooter>
    </Card>
  );
};
const Interactable = React.memo(InteractableComponent);
Interactable.displayName = 'Interactable';
export default Interactable;
