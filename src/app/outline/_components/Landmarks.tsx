'use client';

import React from 'react';

import { useAtom } from 'jotai';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { outlineAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';

import DeleteButton from './DeleteButton';

const Landmarks = ({ elementId }: { elementId: string }) => {
  const [outline, setOutline] = useAtom(outlineAtom);
  const thisElement = outline.elements.find((element) => element.id === elementId);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) => {
    if (!thisElement) return;

    setOutline((outline) => ({
      ...outline,
      elements: outline.elements.map((element) =>
        element.id === thisElement.id ? { ...element, [property]: event.target.value } : element
      ),
    }));
  };

  // const handleDelete = () => {
  //   if (!thisElement) return;

  //   setOutline((outline) => ({
  //     ...outline,
  //     elements: outline.elements.filter(
  //       (element) => element.id !== thisElement.id && element.parentId !== thisElement.id
  //     ),
  //   }));
  // };

  // const handleDelete = () => {
  //   if (!thisElement) return;

  //   setOutline((outline) => {
  //     const deleteCascade = (parentId: string): string[] => {
  //       // Recursively get all child IDs for deletion
  //       const children = outline.elements
  //         .filter((element) => element.parentId === parentId)
  //         .map((element) => element.id);

  //       // Include children of the children in the deletion process
  //       children.forEach((childId) => {
  //         children.push(...deleteCascade(childId)); // Recursion to find descendants
  //       });

  //       return children;
  //     };

  //     const elementsToDelete = deleteCascade(thisElement.id); // Get all IDs to delete

  //     // Filter out the landmark and all its descendants
  //     const updatedElements = outline.elements.filter(
  //       (element) => element.id !== thisElement.id && !elementsToDelete.includes(element.id)
  //     );

  //     return {
  //       ...outline,
  //       elements: updatedElements,
  //     };
  //   });
  // };

  const handleDelete = () => {
    if (!thisElement) return;

    setOutline((outline) => {
      const deleteCascade = (parentId: string): string[] => {
        // Recursively get all child IDs for deletion
        const children = outline.elements
          .filter((element) => element.parentId === parentId)
          .map((element) => element.id);

        // Gather descendants of all children
        const descendants = children.flatMap((childId) => deleteCascade(childId));

        return [...children, ...descendants]; // Return both children and descendants
      };

      const elementsToDelete = deleteCascade(thisElement.id); // Get all IDs to delete

      // Filter out the landmark and all its descendants
      const updatedElements = outline.elements.filter(
        (element) => element.id !== thisElement.id && !elementsToDelete.includes(element.id)
      );

      return {
        ...outline,
        elements: updatedElements,
      };
    });
  };

  return (
    <Card className={cn(`mb-8 w-full bg-primary/10 shadow-xl shadow-base-300`)}>
      <CardHeader className={cn(`relative pt-7`)}>
        <DeleteButton
          first={true}
          handleDelete={handleDelete}
          message="Delete Landmark"
        />
      </CardHeader>
      <CardContent className={cn(`flex flex-col gap-4`)}>
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
