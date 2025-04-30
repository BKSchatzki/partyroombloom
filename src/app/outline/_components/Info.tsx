'use client';

import React, { useCallback, useMemo } from 'react';

import { Theater } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface InfoProps {
  title?: string;
  description?: string;
  goal?: string;
  comments?: string;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) => void;
  tutorialMode: boolean;
}

const InfoComponent: React.FC<InfoProps> = ({
  title,
  description,
  goal,
  comments,
  handleChange,
  tutorialMode,
}) => {
  const infoTextareas = useMemo(
    () => [
      {
        id: 'description',
        label: 'Description',
        placeholder: 'Description',
        value: description,
      },
      {
        id: 'goal',
        label: 'Goal',
        placeholder: 'Goal',
        value: goal,
      },
      {
        id: 'comments',
        label: 'Comments',
        placeholder: 'Comments',
        value: comments,
      },
    ],
    [description, goal, comments]
  );

  return (
    <div className={cn(`pb-4`)}>
      {!tutorialMode && (
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
            <Theater
              aria-hidden={true}
              className={cn(`size-9`)}
            />
            Outline
          </h2>
          <p className={cn(`px-2 text-sm text-base-content/75`)}>
            To set the scene, give it a meaningful title and description, engaging the senses and
            including some flavor and movement. Include a goal and any relevant comments.
          </p>
        </section>
      )}
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
            value={title}
          />
          {infoTextareas.map((item) => (
            <React.Fragment key={item.id}>
              <Label
                className={cn(`sr-only`)}
                htmlFor={item.id}
              >
                {item.label}
              </Label>
              <Textarea
                className={cn(`no-scrollbar`)}
                id={item.id}
                onChange={(event) => handleChange(event, item.id)}
                placeholder={item.placeholder}
                value={item.value}
              />
            </React.Fragment>
          ))}
        </CardContent>
        <CardFooter className={cn(`flex flex-col items-start gap-4`)}></CardFooter>
      </Card>
    </div>
  );
};
const Info = React.memo(InfoComponent);
Info.displayName = 'Info';
export default Info;
