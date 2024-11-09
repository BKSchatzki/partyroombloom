import React from 'react';

import { useAtom } from 'jotai';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { outlineAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';

const Rollable = ({ elementId }: { elementId: string }) => {
  const [outline, setOutline] = useAtom(outlineAtom);
  const thisElement = outline.elements.find((element) => element.id === elementId);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>, property: string) => {
    if (!thisElement) return;
    setOutline((outline) => ({
      ...outline,
      elements: outline.elements.map((element) =>
        element.id === thisElement.id
          ? {
              ...element,
              [property]: event.target.value,
            }
          : element
      ),
    }));
  };

  return (
    <Card className={cn(`w-full bg-warning/10 shadow-xl shadow-base-300`)}>
      <CardContent className={cn(`flex flex-col gap-4 pt-4`)}>
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
          value={thisElement?.rollableSuccess}
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
          value={thisElement?.rollableFailure}
        />
      </CardContent>
    </Card>
  );
};

export default Rollable;
