'use client';

import React, { useCallback } from 'react';

import { useAtom } from 'jotai';
import { Theater } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { existingOutlineAtom, newOutlineAtom, tutorialOutlineAtom } from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

interface InfoProps {
  outlineId: number | null;
  tutorialMode: boolean;
}

const InfoComponent: React.FC<InfoProps> = ({ outlineId, tutorialMode }) => {
  const [tutorialOutline, setTutorialOutline] = useAtom(tutorialOutlineAtom);
  const [newOutline, setNewOutline] = useAtom(newOutlineAtom);
  const [existingOutline, setExistingOutline] = useAtom(existingOutlineAtom);

  const thisOutline = tutorialMode ? tutorialOutline : outlineId ? existingOutline : newOutline;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, property: string) => {
      const updateInfo = (outline: Outline) => ({
        ...outline,
        [property]: event.target.value,
      });
      tutorialMode
        ? setTutorialOutline(updateInfo)
        : outlineId
          ? setExistingOutline(updateInfo)
          : setNewOutline(updateInfo);
    },
    [outlineId, setNewOutline, setExistingOutline, setTutorialOutline, tutorialMode]
  );

  const infoTextareas = ['description', 'goal', 'comments'] as const;

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
            value={thisOutline.title}
          />
          {infoTextareas.map((item) => (
            <React.Fragment key={item}>
              <Label
                className={cn(`sr-only`)}
                htmlFor={item}
              >
                {item}
              </Label>
              <Textarea
                className={cn(`no-scrollbar`)}
                id={item}
                onChange={(event) => handleChange(event, item)}
                placeholder={item.charAt(0).toUpperCase() + item.slice(1)}
                value={thisOutline[item]}
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
