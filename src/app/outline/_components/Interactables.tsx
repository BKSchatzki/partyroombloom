import React from 'react';

import { useAtom } from 'jotai';
import { Plus } from 'lucide-react';
import { v7 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { outlineAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';

import DeleteButton from './DeleteButton';

const Interactables = ({ elementId }: { elementId: string }) => {
  const [outline, setOutline] = useAtom(outlineAtom);
  const thisElement = outline.elements.find((element) => element.id === elementId);

  const handleChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) => {
    if (!id) return;
    setOutline((outline) => ({
      ...outline,
      elements: outline.elements.map((element) =>
        element.id === id ? { ...element, [property]: event.target.value } : element
      ),
    }));
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    setOutline((outline) => ({
      ...outline,
      elements: outline.elements.filter((element) => element.id !== id && element.parentId !== id),
    }));
  };

  const handleAddInteractable = () => {
    if (!thisElement) return;
    setOutline((outline) => ({
      ...outline,
      elements: [
        ...outline.elements,
        {
          id: v7(),
          parentId: thisElement.id,
          type: 'interactable',
          name: '',
          description: '',
          rollable: {
            success: '',
            failure: '',
          },
        },
      ],
    }));
  };

  return (
    <Card className={cn(`relative mb-8 w-full bg-info/10 shadow-lg shadow-base-300`)}>
      <CardTitle className={cn(`absolute left-1/2 top-2.5 line-clamp-1 -translate-x-1/2`)}>
        {thisElement?.name || 'Landmark'}
      </CardTitle>
      {outline.elements
        .filter(
          (element) => element.parentId === thisElement?.id && element.type === 'interactable'
        )
        .map((element, index) => (
          <div key={element.id}>
            <CardHeader className={cn(`relative pt-7`)}>
              <DeleteButton
                first={index === 0}
                handleDelete={() => handleDelete(element.id)}
                message="Delete Interactable"
              />
              <CardTitle className={cn(`relative`)}>
                <div
                  className={cn(
                    `absolute -top-10 left-1/2 flex -translate-x-1/2 items-center gap-2`
                  )}
                >
                  <span className={cn(`sr-only`)}>Interactable</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(`flex flex-col gap-4`)}>
              <Label
                className={cn(`sr-only`)}
                htmlFor={`name-${element.id}`}
              >
                Interactable Name
              </Label>
              <Input
                className={cn(`w-full`)}
                id={`name-${element.id}`}
                onChange={(event) => handleChange(element.id, event, 'name')}
                placeholder={`Name`}
                value={element.name}
              />
              <Label
                className={cn(`sr-only`)}
                htmlFor={`description-${element.id}`}
              >
                Interactable Description
              </Label>
              <Textarea
                className={cn(`no-scrollbar`)}
                id={`description-${element.id}`}
                onChange={(event) => handleChange(element.id, event, 'description')}
                placeholder={`Description`}
                value={element.description}
              />
            </CardContent>
            <Separator className={cn(`my-2 mb-0`)} />
          </div>
        ))}
      <CardFooter className={cn(`mt-5 flex flex-col items-start gap-4`)}>
        <Card
          className={cn(
            `mx-auto mb-2 mt-6 w-[99%] rounded-full bg-info/10 shadow-xl shadow-base-300`
          )}
        >
          <Button
            color={`ghost`}
            onClick={handleAddInteractable}
            size={`block`}
          >
            <Plus className={cn(`size-5`)} /> Interactable
          </Button>
        </Card>
      </CardFooter>
    </Card>
  );
};

export default Interactables;
