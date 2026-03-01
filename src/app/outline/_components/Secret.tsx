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

import Rollable from './Rollable';
import OutlineNodeItem from './OutlineNodeItem';
import { SECRET_GROUP_CONFIG, SECRET_ITEM_CONFIG } from './outlineNodeConfig';

interface SecretProps {
  elementId: string;
  outlineId: number | null;
  tutorialMode: boolean;
}

const SecretComponent: React.FC<SecretProps> = ({ elementId, outlineId, tutorialMode }) => {
  const mode = getOutlineMode(tutorialMode, outlineId);
  const thisElement = useAtomValue(outlineNodeAtomFamily(`${mode}:${elementId}`));
  const secretIds = useAtomValue(outlineChildIdsAtomFamily(`${mode}:${elementId}`));
  const addChildNode = useSetAtom(addChildNodeAtomFamily(mode));
  const updateNodeField = useSetAtom(updateOutlineNodeFieldAtomFamily(mode));
  const deleteNode = useSetAtom(deleteOutlineNodeAtomFamily(mode));
  const hasElements = secretIds.length > 0;

  const handleAddSecret = useCallback(() => {
    addChildNode({
      parentId: elementId,
      childType: 'secret',
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
    <Card className={cn(SECRET_GROUP_CONFIG.cardClassName)}>
      <CardTitle className={cn(SECRET_GROUP_CONFIG.titleClassName)}>
        {thisElement?.name || SECRET_GROUP_CONFIG.parentTitleFallback}
      </CardTitle>
      {secretIds.map((secretId, index) => (
        <OutlineNodeItem
          key={secretId}
          nodeId={secretId}
          mode={mode}
          first={index === 0}
          itemConfig={SECRET_ITEM_CONFIG}
          onDelete={handleDelete}
          onChange={handleChange}
          extraFields={
            <div className={cn(SECRET_ITEM_CONFIG.extraFieldsWrapperClassName)}>
              <Rollable
                elementId={secretId}
                outlineId={outlineId}
                tutorialMode={tutorialMode}
              />
            </div>
          }
        />
      ))}
      <CardFooter className={cn(SECRET_GROUP_CONFIG.footerClassName)}>
        <Card
          className={cn(
            SECRET_GROUP_CONFIG.addCardClassName,
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
              className={cn(SECRET_GROUP_CONFIG.addIconClassName)}
            />{' '}
            {SECRET_GROUP_CONFIG.addLabel}
          </Button>
        </Card>
      </CardFooter>
    </Card>
  );
};
const Secret = React.memo(SecretComponent);
Secret.displayName = 'Secret';
export default Secret;
