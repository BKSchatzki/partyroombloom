import React from 'react';

import { useAtom } from 'jotai';
import {
  Lock,
  MousePointerClick,
  Pyramid,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { outlineAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';

import { Threadline } from '../../../components/ui/threadline';

const Review = () => {
  const [outline] = useAtom(outlineAtom);

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 px-4 pb-4`)}>
      <div className={cn(`flex flex-col gap-2`)}>
        <span>Info</span>
        <span>{outline.info.title}</span>
        <span>{outline.info.description}</span>
        <span>{outline.info.goal}</span>
        <span>{outline.info.comments}</span>
      </div>
      <Separator className={cn(`my-2 border-base-300`)} />
      <div className={cn(`flex flex-col`)}>
        {/* Landmarks */}
        {outline.elements
          .filter((element) => element.type === 'landmark')
          .map((landmark) => (
            <div
              className={cn(`relative flex flex-col gap-2 p-4`)}
              key={landmark.id}
            >
              <span className={cn(`flex items-center gap-2 text-2xl text-primary`)}>
                <Pyramid className={cn(`size-7`)} />
                {landmark.name}
              </span>
              <span>{landmark.description}</span>
              {/* Interactables */}
              {outline.elements
                .filter(
                  (element) => element.parentId === landmark.id && element.type === 'interactable'
                )
                .map((interactable) => (
                  <div
                    key={interactable.id}
                    className={cn(`relative flex flex-col gap-2 pl-6`)}
                  >
                    <span className={cn(`flex items-center gap-2 text-xl text-info`)}>
                      <MousePointerClick className={cn(`size-6`)} />
                      {interactable.name}
                    </span>
                    <span>{interactable.description}</span>
                    {/* Secrets */}
                    {outline.elements
                      .filter(
                        (element) =>
                          element.parentId === interactable.id && element.type === 'secret'
                      )
                      // .sort((a, b) => a.parentId.localeCompare(b.parentId))
                      .map((secret) => (
                        <div
                          key={secret.id}
                          className={cn(`relative flex flex-col gap-2 pl-6`)}
                        >
                          <Threadline color={`info`} />
                          <span className={cn(`flex items-center gap-2 text-lg text-error`)}>
                            <Lock className={cn(`size-5`)} />
                            {secret.name}
                          </span>
                          <span>{secret.description}</span>
                          {/* Rollables */}
                          <div className={cn(`relative flex flex-col gap-2 pl-6`)}>
                            <Threadline color={`error`} />
                            <span className={cn(`flex items-center gap-2 text-warning`)}>
                              <ThumbsUp className={cn(`size-4`)} />
                              Success
                            </span>
                            <span>{secret.rollable.success}</span>
                            <span className={cn(`flex items-center gap-2 text-warning`)}>
                              <ThumbsDown className={cn(`size-4`)} />
                              Failure
                            </span>
                            <span>{secret.rollable.failure}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </ScrollArea>
  );
};

export default Review;
