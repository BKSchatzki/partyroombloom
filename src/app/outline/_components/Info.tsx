'use client';

import React from 'react';

import { useAtom } from 'jotai';

import {
  Card,
  CardContent,
  CardDescription,
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

const Info = () => {
  const [outline, setOutline] = useAtom(outlineAtom);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) => {
    setOutline((outline) => ({
      ...outline,
      info: {
        ...outline,
        [property]: event.target.value,
      },
    }));
  };

  return (
    <div className={cn(`flex flex-col gap-12`)}>
      <Card className={cn(`bg-neutral/50 shadow-xl shadow-base-300`)}>
        <CardHeader>
          <CardTitle>Let's set the scene.</CardTitle>
          <CardDescription>
            First, give your scene a meaningful title and description. Try to engage the senses and
            include some flavor and movement.
          </CardDescription>
          <Separator className={cn(`my-2 border-base-300`)} />
        </CardHeader>
        <CardContent className={cn(`flex flex-col gap-4`)}>
          <Label
            className={cn(`sr-only`)}
            htmlFor={`title`}
          >
            Title
          </Label>
          <Input
            className={cn(`w-full`)}
            id={`title`}
            onChange={(event) => handleChange(event, 'title')}
            placeholder={`Title`}
            value={outline.title}
          />
          <Label
            className={cn(`sr-only`)}
            htmlFor={`description`}
          >
            Description
          </Label>
          <Textarea
            className={cn(`no-scrollbar`)}
            id={`description`}
            onChange={(event) => handleChange(event, 'description')}
            placeholder={`Description`}
            value={outline.description}
          />
          <Label
            className={cn(`sr-only`)}
            htmlFor={`goal`}
          >
            Goal
          </Label>
          <Textarea
            className={cn(`no-scrollbar`)}
            id={`goal`}
            onChange={(event) => handleChange(event, 'goal')}
            placeholder={`Goal`}
            value={outline.goal}
          />
          <Label
            className={cn(`sr-only`)}
            htmlFor={`comments`}
          >
            Comments
          </Label>
          <Textarea
            className={cn(`no-scrollbar`)}
            id={`comments`}
            onChange={(event) => handleChange(event, 'comments')}
            placeholder={`Comments`}
            value={outline.comments}
          />
          <Separator className={cn(`my-2 border-base-300`)} />
        </CardContent>
        <CardFooter className={cn(`flex flex-col items-start gap-4`)}></CardFooter>
      </Card>
    </div>
  );
};

export default Info;
