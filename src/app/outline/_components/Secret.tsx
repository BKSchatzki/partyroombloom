'use client';

import React, { useCallback } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { Plus } from 'lucide-react';

import DeleteButton from '@/components/DeleteButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  addChildNodeAtomFamily,
  deleteOutlineNodeAtomFamily,
  outlineChildIdsAtomFamily,
  outlineNodeAtomFamily,
  updateOutlineNodeFieldAtomFamily,
} from '@/lib/atoms';
import { getOutlineMode, OutlineMode, OutlineNodeField } from '@/lib/outlineState';
import { cn } from '@/lib/utils';

import Rollable from './Rollable';

interface SecretProps {
  elementId: string;
  outlineId: number | null;
  tutorialMode: boolean;
}

interface SecretItemProps {
  nodeId: string;
  mode: OutlineMode;
  outlineId: number | null;
  tutorialMode: boolean;
  first: boolean;
  onDelete: (id: string) => void;
  onChange: (
    id: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: OutlineNodeField
  ) => void;
}

const SecretItemComponent: React.FC<SecretItemProps> = ({
  nodeId,
  mode,
  outlineId,
  tutorialMode,
  first,
  onDelete,
  onChange,
}) => {
  const node = useAtomValue(outlineNodeAtomFamily(`${mode}:${nodeId}`));

  if (!node) {
    return null;
  }

  return (
    <div>
      <CardHeader className={cn(`relative pt-7`)}>
        <DeleteButton
          first={first}
          handleDelete={() => onDelete(nodeId)}
          item={node.name || 'this Secret'}
          message="Delete Secret"
        />
        <CardTitle className={cn(`relative`)}>
          <div
            className={cn(`absolute -top-10 left-1/2 flex -translate-x-1/2 items-center gap-2`)}
          >
            <span className={cn(`sr-only`)}>Secret</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(`flex flex-col gap-4 max-sm:px-2`)}>
        <Label
          className={cn(`sr-only`)}
          htmlFor={`name-${nodeId}`}
        >
          Secret Name
        </Label>
        <Input
          className={cn(`w-full`)}
          id={`name-${nodeId}`}
          onChange={(event) => onChange(nodeId, event, 'name')}
          placeholder={`Name`}
          value={node.name}
        />
        <Label
          className={cn(`sr-only`)}
          htmlFor={`description-${nodeId}`}
        >
          Secret Description
        </Label>
        <Textarea
          className={cn(`no-scrollbar`)}
          id={`description-${nodeId}`}
          onChange={(event) => onChange(nodeId, event, 'description')}
          placeholder={`Description`}
          value={node.description}
        />
        <div className={cn(`max-sm:mx-[-0.5rem]`)}>
          <Rollable
            elementId={nodeId}
            outlineId={outlineId}
            tutorialMode={tutorialMode}
          />
        </div>
      </CardContent>
      <Separator className={cn(`my-2 mb-0`)} />
    </div>
  );
};

const SecretItem = React.memo(SecretItemComponent);
SecretItem.displayName = 'SecretItem';

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
    <Card
      className={cn(
        `relative mb-8 w-full bg-error/10 shadow-lg shadow-base-300 max-sm:rounded-none`
      )}
    >
      <CardTitle className={cn(`absolute left-4 top-2.5 line-clamp-1 sm:left-8`)}>
        {thisElement?.name || 'Interactable'}
      </CardTitle>
      {secretIds.map((secretId, index) => (
        <SecretItem
          key={secretId}
          nodeId={secretId}
          mode={mode}
          outlineId={outlineId}
          tutorialMode={tutorialMode}
          first={index === 0}
          onDelete={handleDelete}
          onChange={handleChange}
        />
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
const Secret = React.memo(SecretComponent);
Secret.displayName = 'Secret';
export default Secret;
