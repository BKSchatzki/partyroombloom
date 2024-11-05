import React from 'react';

import { useAtom } from 'jotai';
import {
  Lock,
  MousePointerClick,
  Pyramid,
  Theater,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { outlineAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';

// import { Threadline } from '../../../components/ui/threadline';

const Review = () => {
  const [outline] = useAtom(outlineAtom);

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 px-4 pb-4`)}>
      <Card className={cn(`flex flex-col gap-2 bg-neutral/50 p-4 shadow-xl shadow-base-300`)}>
        <span className={cn(`flex items-center gap-2 text-2xl text-neutral brightness-[3]`)}>
          <Theater className={cn(`size-7`)} />
          {outline.info.title}
        </span>
        <span>{outline.info.description}</span>
        <span>{outline.info.goal}</span>
        <span>{outline.info.comments}</span>
      </Card>
      <Separator className={cn(`my-3 border-base-300`)} />
      <div className={cn(`flex flex-col gap-6`)}>
        {/* Landmarks */}
        {outline.elements
          .filter((element) => element.type === 'landmark')
          .map((landmark) => (
            <Card
              className={cn(
                `relative flex flex-col gap-7 bg-primary/10 p-4 shadow-xl shadow-base-300`
              )}
              key={landmark.id}
            >
              <div className={cn(`flex flex-col gap-2`)}>
                <span className={cn(`flex items-center gap-2 text-2xl text-primary`)}>
                  <Pyramid className={cn(`size-7`)} />
                  {landmark.name}
                </span>
                <span>{landmark.description}</span>
              </div>
              {/* Interactables */}
              <div className={cn(`flex flex-col gap-10`)}>
                {outline.elements
                  .filter(
                    (element) => element.parentId === landmark.id && element.type === 'interactable'
                  )
                  .map((interactable) => (
                    <Card
                      key={interactable.id}
                      className={cn(
                        `relative -m-3 flex flex-col gap-7 bg-info/10 p-4 shadow-lg shadow-base-200`
                      )}
                    >
                      <div className={cn(`flex flex-col gap-2`)}>
                        <span className={cn(`flex items-center gap-2 text-xl text-info`)}>
                          <MousePointerClick className={cn(`size-6`)} />
                          {interactable.name}
                        </span>
                        <span>{interactable.description}</span>
                      </div>
                      {/* Secrets */}
                      <div className={cn(`flex flex-col gap-8`)}>
                        {outline.elements
                          .filter(
                            (element) =>
                              element.parentId === interactable.id && element.type === 'secret'
                          )
                          // .sort((a, b) => a.parentId.localeCompare(b.parentId))
                          .map((secret) => (
                            <Card
                              key={secret.id}
                              className={cn(
                                `relative -m-3 flex flex-col gap-7 bg-error/10 p-4 shadow-md shadow-base-100`
                              )}
                            >
                              {/* <Threadline color={`info`} /> */}
                              <div className={cn(`flex flex-col gap-2`)}>
                                <span className={cn(`flex items-center gap-2 text-lg text-error`)}>
                                  <Lock className={cn(`size-5`)} />
                                  {secret.name}
                                </span>
                                <span>{secret.description}</span>
                              </div>
                              {/* Rollables */}
                              <Card
                                className={cn(
                                  `relative -m-3 flex flex-col gap-2 bg-warning/10 p-4 shadow-sm shadow-base-100`
                                )}
                              >
                                {/* <Threadline color={`error`} /> */}
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
                              </Card>
                            </Card>
                          ))}
                      </div>
                    </Card>
                  ))}
              </div>
            </Card>
          ))}
      </div>
    </ScrollArea>
  );
};

export default Review;
