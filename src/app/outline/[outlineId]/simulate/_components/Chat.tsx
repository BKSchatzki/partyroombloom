'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useAtom } from 'jotai';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  conversationAtom,
  outlinesListAtom,
  userMessageAtom,
  userMessageInit,
} from '@/lib/atoms';
import type { UserMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

import ChatOptions from './ChatOptions';

const Chat = ({ outlineId }: { outlineId: string }) => {
  const [outlinesList] = useAtom(outlinesListAtom);
  const outline = outlinesList.find((outline) => outline.id === parseInt(outlineId));
  const [conversation, setConversation] = useAtom(conversationAtom);
  const [userMessage, setUserMessage] = useAtom(userMessageAtom);
  const [embla, setEmbla] = useState<CarouselApi>();

  const { isLoading, error } = useQuery({
    queryKey: ['conversation'],
    queryFn: async () => {
      if (conversation.length) {
        return conversation;
      }

      const response = await fetch('/api/simulate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: outline,
          conversation: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversation: ${response.status}`);
      }

      const data = await response.json();

      setConversation(data.updatedConversation);
      return data.updatedConversation;
    },
  });

  const handleSubmit = async (userMessage: UserMessage) => {
    try {
      const response = await fetch('/api/simulate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userMessage.content,
          conversation: conversation,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      setConversation(data.updatedConversation);
      setUserMessage(userMessageInit);
      return data.updatedConversation;
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!embla) {
      return;
    }
    embla.scrollTo(conversation.length - 1);
  }, [embla, conversation.length]);

  if (isLoading) {
    return (
      <Skeleton className={cn(`flex h-96 w-full flex-col items-center justify-center`)}>
        <span className="loading loading-spinner loading-lg"></span>
      </Skeleton>
    );
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <>
      <Carousel
        setApi={setEmbla}
        className={cn(`h-full max-w-full`)}
      >
        <div className={cn(`flex max-h-full flex-col pb-4`)}>
          <CarouselContent>
            {conversation.map((message, index) =>
              message.role === 'assistant' ? (
                <CarouselItem
                  key={index}
                  className={cn(`basis-full py-4`)}
                >
                  <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 px-4 pb-4`)}>
                    {/* <div key={message.content.headline}> */}
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
                          disabled={index !== conversation.length - 1}
                        />
                        <Button
                          color={`primary`}
                          onClick={() => handleSubmit(userMessage)}
                        >
                          Submit
                        </Button>
                      </div>
                    ) : null}
                    {/* </div> */}
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
    </>
  );
};

export default Chat;
