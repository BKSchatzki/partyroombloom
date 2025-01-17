'use client';

import React, { useCallback } from 'react';

import { useAtom } from 'jotai';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  newOutlineAtom,
  outlineAtom,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';

import DeleteButton from '../../../components/DeleteButton';

const Landmarks = ({ elementId, outlineId }: { elementId: string; outlineId: number | null }) => {
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [outline, setOutline] = useAtom(outlineAtom);

  const thisElement = outlineId
    ? outline.elements.find((element) => element.id === elementId)
    : newOutline.elements.find((element) => element.id === elementId);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, property: string) => {
      if (!thisElement) return;
      if (!outlineId) {
        setNewOutline((outline) => ({
          ...outline,
          elements: outline.elements.map((element) =>
            element.id === thisElement.id ? { ...element, [property]: event.target.value } : element
          ),
        }));
      }
      if (outlineId) {
        setOutline((outline) => ({
          ...outline,
          elements: outline.elements.map((element) =>
            element.id === thisElement.id ? { ...element, [property]: event.target.value } : element
          ),
        }));
      }
    },
    [outlineId, setNewOutline, setOutline, thisElement]
  );

  const handleDelete = () => {
    if (!thisElement) return;
    if (!outlineId) {
      setNewOutline((outline) => {
        const deleteCascade = (parentId: string): string[] => {
          const children = outline.elements
            .filter((element) => element.parentId === parentId)
            .map((element) => element.id);
          const descendants = children.flatMap((childId) => deleteCascade(childId));
          return [...children, ...descendants];
        };
        const elementsToDelete = deleteCascade(thisElement.id);
        const updatedElements = outline.elements.filter(
          (element) => element.id !== thisElement.id && !elementsToDelete.includes(element.id)
        );
        return {
          ...outline,
          elements: updatedElements,
        };
      });
    }
    if (outlineId) {
      setOutline((outline) => {
        const deleteCascade = (parentId: string): string[] => {
          const children = outline.elements
            .filter((element) => element.parentId === parentId)
            .map((element) => element.id);
          const descendants = children.flatMap((childId) => deleteCascade(childId));
          return [...children, ...descendants];
        };
        const elementsToDelete = deleteCascade(thisElement.id);
        const updatedElements = outline.elements.filter(
          (element) => element.id !== thisElement.id && !elementsToDelete.includes(element.id)
        );
        return {
          ...outline,
          elements: updatedElements,
        };
      });
    }
  };

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
          value={thisElement?.name}
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
          value={thisElement?.description}
        />
      </CardContent>
    </Card>
  );
};

export default Landmarks;
