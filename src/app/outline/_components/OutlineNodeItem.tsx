'use client';

import React from 'react';

import { useAtomValue } from 'jotai';

import DeleteButton from '@/components/DeleteButton';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { outlineNodeAtomFamily } from '@/lib/atoms';
import { OutlineMode, OutlineNodeField } from '@/lib/outlineState';
import { cn } from '@/lib/utils';

import OutlineNodeFields from './OutlineNodeFields';
import { OutlineNodeItemConfig } from './outlineNodeConfig';

interface OutlineNodeItemProps {
  mode: OutlineMode;
  nodeId: string;
  first: boolean;
  itemConfig: OutlineNodeItemConfig;
  onDelete: (id: string) => void;
  onChange: (
    id: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: OutlineNodeField
  ) => void;
  extraFields?: React.ReactNode;
}

const OutlineNodeItemComponent: React.FC<OutlineNodeItemProps> = ({
  mode,
  nodeId,
  first,
  itemConfig,
  onDelete,
  onChange,
  extraFields,
}) => {
  const node = useAtomValue(outlineNodeAtomFamily(`${mode}:${nodeId}`));

  if (!node) {
    return null;
  }

  return (
    <div>
      <CardHeader className={cn(itemConfig.headerClassName)}>
        <DeleteButton
          first={first}
          handleDelete={() => onDelete(nodeId)}
          item={node.name || itemConfig.deleteItemFallback}
          message={itemConfig.deleteMessage}
        />
        {itemConfig.srOnlyTypeLabel && (
          <CardTitle className={cn(`relative`)}>
            <div
              className={cn(`absolute -top-10 left-1/2 flex -translate-x-1/2 items-center gap-2`)}
            >
              <span className={cn(`sr-only`)}>{itemConfig.srOnlyTypeLabel}</span>
            </div>
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className={cn(itemConfig.contentClassName)}>
        <OutlineNodeFields
          nodeId={nodeId}
          nameValue={node.name}
          descriptionValue={node.description}
          fieldsConfig={itemConfig.fields}
          onChange={onChange}
        />
        {extraFields}
      </CardContent>
      {itemConfig.showSeparator && itemConfig.separatorClassName && (
        <Separator className={cn(itemConfig.separatorClassName)} />
      )}
    </div>
  );
};

const OutlineNodeItem = React.memo(OutlineNodeItemComponent);
OutlineNodeItem.displayName = 'OutlineNodeItem';

export default OutlineNodeItem;
