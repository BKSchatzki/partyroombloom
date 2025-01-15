'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useAtom } from 'jotai';
import {
  Check,
  Save,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

const Chat = ({
  outlineId,
  simulateId,
}: {
  outlineId: string | null;
  simulateId: number | null;
}) => {
  const [outlinesList] = useAtom(outlinesListAtom);
  const [conversation, setConversation] = useAtom(conversationAtom);
  const [userMessage, setUserMessage] = useAtom(userMessageAtom);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [embla, setEmbla] = useState<CarouselApi>();
  let outline = null;
  if (outlineId) {
    outline = outlinesList.find((outline) => outline.id === parseInt(outlineId));
  }

  const router = useRouter();

  const { isLoading, error } = useQuery({
    queryKey: ['conversation'],
    queryFn: async () => {
      let response;
      if (simulateId === null) {
        response = await fetch('/api/simulate/converse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: outline,
            conversation: [],
          }),
        });
      } else {
        response = await fetch(`/api/simulate/${simulateId}`);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch conversation: ${response.status}`);
      }

      const data = await response.json();

      setConversation(data);
      setIsLocalLoading(false);
      return data;
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

      setConversation(data);
      setUserMessage(userMessageInit);
      setIsSaving(false);
      return data;
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (simulateId) {
      try {
        const response = await fetch(`/api/simulate/${simulateId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversation }),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error saving conversation:', error);
      } finally {
        setIsSaving(false);
      }
    }
    if (!simulateId) {
      try {
        const response = await fetch('/api/simulate/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversation, outline }),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        router.push(`/overview`);
      } catch (error) {
        console.error('Error saving conversation:', error);
      } finally {
        setIsSaving(false);
      }
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

  if (isLoading || isLocalLoading) {
    return (
      <Skeleton className={cn(`flex h-screen w-full flex-col items-center rounded-none p-8`)}>
        <span className={cn(`loading loading-spinner loading-lg`)}></span>
      </Skeleton>
    );
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
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
                    <div className={cn(`mx-auto flex flex-col gap-6 p-4 max-sm:px-0`)}>
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
                          `bg-indigo-600 outline-none ring-indigo-500 ring-offset-2 ring-offset-base-300 transition-all duration-100 ease-in-out hover:bg-indigo-600 hover:brightness-90 focus:ring-2 disabled:bg-indigo-600/30 max-sm:mx-1`
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
              `border-indigo-500 text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500 focus-visible:outline-indigo-500 disabled:border-indigo-500/30 disabled:bg-indigo-500/10 disabled:text-indigo-500/30`
            )}
          />
          <CarouselNext
            color={`default`}
            className={cn(
              `border-indigo-500 text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500 focus-visible:outline-indigo-500 disabled:border-indigo-500/30 disabled:bg-indigo-500/10 disabled:text-indigo-500/30`
            )}
          />
          <Button
            onClick={handleSave}
            color={`default`}
            disabled={isSaving}
            outlined={true}
            className={cn(
              `absolute bottom-0 right-20 flex items-center gap-2 border-indigo-500 text-indigo-500 outline-none ring-indigo-500 ring-offset-2 ring-offset-base-300 transition-all duration-100 ease-in-out hover:border-indigo-500 hover:bg-indigo-500 hover:brightness-90 focus:ring-2 disabled:border-indigo-500/30 disabled:bg-indigo-500/10 disabled:text-indigo-500/30`
            )}
          >
            <Save className={cn(`size-5`)} />
            {isSaving ? `Saving...` : `Save Outline`}
          </Button>
        </div>
      </div>
    </Carousel>
  );
};

export default Chat;
