'use client';

import React, { useCallback } from 'react';

import { useAtom } from 'jotai';
import { Theater } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { newOutlineAtom, outlineAtom, tutorialOutlineAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';

interface InfoProps {
  outlineId: number | null;
  tutorialMode: boolean;
}

const InfoComponent: React.FC<InfoProps> = ({ outlineId, tutorialMode }) => {
  const [tutorialOutline, setTutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [outline, setOutline] = useAtom(outlineAtom);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, property: string) => {
      if (tutorialMode) {
        setTutorialOutline((outline) => ({
          ...outline,
          [property]: event.target.value,
        }));
      } else if (!outlineId) {
        setNewOutline((outline) => ({
          ...outline,
          [property]: event.target.value,
        }));
      }
      if (outlineId) {
        setOutline((outline) => ({
          ...outline,
          [property]: event.target.value,
        }));
      }
    },
    [outlineId, setNewOutline, setOutline, setTutorialOutline, tutorialMode]
  );

  return (
    <div className={cn(`pb-4`)}>
      <section
        className={cn(
          `my-8 flex items-center justify-center gap-4 text-[#64d8b4] max-sm:flex-col sm:gap-2`
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
            value={
              tutorialMode //
                ? tutorialOutline.title
                : outlineId
                  ? outline.title
                  : newOutline.title
            }
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
            value={
              tutorialMode //
                ? tutorialOutline.description
                : outlineId
                  ? outline.description
                  : newOutline.description
            }
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
            value={
              tutorialMode //
                ? tutorialOutline.goal
                : outlineId
                  ? outline.goal
                  : newOutline.goal
            }
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
            value={
              tutorialMode //
                ? tutorialOutline.comments
                : outlineId
                  ? outline.comments
                  : newOutline.comments
            }
          />
        </CardContent>
        <CardFooter className={cn(`flex flex-col items-start gap-4`)}></CardFooter>
      </Card>
    </div>
  );
};

const Info = React.memo(InfoComponent);

Info.displayName = 'Info';

export default Info;
