import React from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { mockStructuredChat } from '@/mock/mockStructuredChat';

import ChatOptions from './ChatOptions';

const Chat: React.FC = () => {
  return (
    <Carousel className={cn(`h-full max-w-full`)}>
      <div className={cn(`flex max-h-full flex-col pb-4`)}>
        <CarouselContent>
          {mockStructuredChat.map((message, index) =>
            message.role === 'assistant' ? (
              <CarouselItem
                key={index}
                className={cn(`basis-full py-4`)}
              >
                <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 px-4 pb-4`)}>
                  <div key={message.content.headline}>
                    {message.role === 'assistant' ? (
                      <div className={cn(`mx-auto flex flex-col gap-6 p-4`)}>
                        <h3 className={cn(`text-2xl font-bold`)}>{message.content.headline}</h3>
                        <div className={cn(`flex flex-col gap-4`)}>
                          {message.content.narration?.map((narration) => (
                            <p key={narration}>{narration}</p>
                          ))}
                        </div>
                        <Separator className={cn(`my-2 border-base-300`)} />
                        <ChatOptions
                          prompt={message.content.prompt || ''}
                          options={message.content.options || []}
                          index={index}
                          disabled={index !== mockStructuredChat.length - 1}
                        />
                      </div>
                    ) : null}
                  </div>
                </ScrollArea>
              </CarouselItem>
            ) : null
          )}
        </CarouselContent>
        <div className={cn(`relative h-16`)}>
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </Carousel>
  );
};

export default Chat;
