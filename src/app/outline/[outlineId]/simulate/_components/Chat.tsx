'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useAtom } from 'jotai';
import {
  Check,
  Sparkles,
} from 'lucide-react';

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
  const [isSaving, setIsSaving] = useState(false);
  const [embla, setEmbla] = useState<CarouselApi>();

  const { isLoading, error } = useQuery({
    queryKey: ['conversation'],
    queryFn: async () => {
      if (conversation.length) {
        return conversation;
      }

      const response = await fetch('/api/simulate/converse', {
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
    setIsSaving(true);
    try {
      const response = await fetch('/api/simulate/converse', {
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
      setIsSaving(false);
      return data.updatedConversation;
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!embla) {
      return;
    }
    embla.on('init', () => {
      embla.scrollTo(conversation.length - 1);
    });
    embla.on('slidesChanged', () => {
      embla.scrollTo(conversation.length - 1);
    });
  }, [embla, conversation.length]);

  if (isLoading) {
    return (
      <Skeleton className={cn(`flex h-screen w-full flex-col items-center p-8`)}>
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
                    {message.role === 'assistant' ? (
                      <div className={cn(`mx-auto flex flex-col gap-6 p-4`)}>
                        <h3 className={cn(`text-2xl font-bold`)}>{message.content.headline}</h3>
                        <div className={cn(`flex flex-col gap-4`)}>
                          {message.content.narration?.map((narration) => (
                            <p key={narration}>{narration}</p>
                          ))}
                        </div>
                        <Separator className={cn(`my-2 border-base-300`)} />
                        <p className={cn(`text-lg font-bold`)}>{message.content.prompt || ''}</p>
                        <ChatOptions
                          options={message.content.options || []}
                          index={index}
                          disabled={index !== conversation.length - 1}
                        />
                        <Button
                          disabled={isSaving || index !== conversation.length - 1}
                          onClick={() => handleSubmit(userMessage)}
                          className={cn(
                            `bg-indigo-600 transition-all duration-100 ease-in-out hover:bg-indigo-600 hover:brightness-90 disabled:bg-indigo-600/30`
                          )}
                        >
                          {isSaving ? (
                            <span className={cn(`flex items-center gap-2`)}>
                              <Sparkles className={cn(`size-3 animate-spin`)} />
                              Thinking...
                            </span>
                          ) : index !== conversation.length - 1 ? (
                            <span className={cn(`flex items-center gap-2`)}>
                              <Check className={cn(`size-3`)} /> Submit
                            </span>
                          ) : (
                            <span className={cn(`flex items-center gap-2`)}>
                              <Sparkles className={cn(`size-3`)} />
                              Send
                            </span>
                          )}
                        </Button>
                      </div>
                    ) : null}
                  </ScrollArea>
                </CarouselItem>
              ) : null
            )}
          </CarouselContent>
          <div className={cn(`relative h-16`)}>
            <CarouselPrevious
              color={`default`}
              className={cn(
                `border-indigo-600 text-indigo-600 hover:border-indigo-600 hover:bg-indigo-600 focus-visible:outline-indigo-600 disabled:border-indigo-600/30 disabled:bg-indigo-600/10 disabled:text-indigo-600/30`
              )}
            />
            <CarouselNext
              color={`default`}
              className={cn(
                `border-indigo-600 text-indigo-600 hover:border-indigo-600 hover:bg-indigo-600 focus-visible:outline-indigo-600 disabled:border-indigo-600/30 disabled:bg-indigo-600/10 disabled:text-indigo-600/30`
              )}
            />
          </div>
        </div>
      </Carousel>
    </>
  );
};

export default Chat;
