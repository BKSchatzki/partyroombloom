'use client';

import React from 'react';

import { useAtom } from 'jotai';
import { Theater } from 'lucide-react';

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
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { outlineAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';

const Info = ({ isLoading }: { isLoading: boolean }) => {
  const [outline, setOutline] = useAtom(outlineAtom);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) => {
    setOutline((outline) => ({
      ...outline,
      [property]: event.target.value,
    }));
  };

  return (
    <div>
      <section
        className={cn(
          `mb-8 mt-4 flex items-center justify-center gap-4 text-[#64d8b4] max-sm:flex-col sm:gap-2`
        )}
      >
        <h2
          className={cn(
            `flex w-full shrink-0 items-center gap-2 px-2 text-3xl sm:basis-1/3 sm:justify-center`
          )}
        >
          {' '}
          <Theater className={cn(`size-9`)} />
          Outline
        </h2>
        <p className={cn(`px-2 text-sm text-base-content/75`)}>
          To set the scene, give it a meaningful title and description, engaging the senses and
          including some flavor and movement. Include a goal and any relevant comments.
        </p>
      </section>
      {isLoading ? (
        <Skeleton className={cn(`flex h-96 w-full flex-col items-center justify-center`)}>
          <span className="loading loading-spinner loading-lg"></span>
        </Skeleton>
      ) : (
        <Card className={cn(`bg-neutral/50 shadow-xl shadow-base-300 max-sm:rounded-none`)}>
          <CardHeader></CardHeader>
          <CardContent className={cn(`flex flex-col gap-4 max-sm:px-2`)}>
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
          </CardContent>
          <CardFooter className={cn(`flex flex-col items-start gap-4`)}></CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Info;
