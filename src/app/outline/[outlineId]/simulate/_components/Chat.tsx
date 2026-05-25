'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import type { ClientUser } from '@/lib/auth';
import { Check, Coins, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

import GenericError from '@/components/GenericError';
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
import { conversationAtom, outlinesListAtom, userMessageAtom, userMessageInit } from '@/lib/atoms';
import { ConversationResponseSchema, OutlineTreeSchema } from '@/lib/schemas';
import type { Outline, UserMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

import ChatOptions from './ChatOptions';

interface ChatProps {
  outlineId: string | null;
  simulateId: number | null;
  user: ClientUser | null;
}

const ChatComponent: React.FC<ChatProps> = ({ outlineId, simulateId, user }) => {
  const [tokenCount, setTokenCount] = useState(user ? user.chatTokens : 0);
  const [outlinesList] = useAtom(outlinesListAtom);
  const [conversation, setConversation] = useAtom(conversationAtom);
  const [userMessage, setUserMessage] = useAtom(userMessageAtom);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [currentSimulateId, setCurrentSimulateId] = useState(simulateId);
  const [embla, setEmbla] = useState<CarouselApi>();
  let outline: Outline | null = null;
  if (outlineId) {
    outline = outlinesList.find((outline) => outline.id === parseInt(outlineId, 10)) ?? null;
  }

  const router = useRouter();

  const { isLoading, error } = useQuery({
    queryKey: ['conversation', outlineId, simulateId],
    queryFn: async () => {
      if (simulateId === null) {
        if (!user || tokenCount <= 0) {
          setTokenCount(0);
          router.push('/overview');
          return tokenCount;
        }
        let selectedOutline = outline;
        if (!selectedOutline && outlineId) {
          const outlineResponse = await fetch(`/api/outline/${outlineId}`);
          if (!outlineResponse.ok) {
            throw new Error(`Failed to fetch outline: ${outlineResponse.status}`);
          }
          const parsedOutline = OutlineTreeSchema.safeParse(await outlineResponse.json());
          if (!parsedOutline.success) {
            throw new Error('Invalid outline payload');
          }
          selectedOutline = parsedOutline.data;
        }

        if (!selectedOutline) {
          throw new Error('Outline is required to start a simulation');
        }

        const conversationResponse = await fetch('/api/simulate/converse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: selectedOutline,
            conversation: [],
          }),
        });
        if (!conversationResponse.ok) {
          throw new Error(`Failed to fetch conversation: ${conversationResponse.status}`);
        }
        const parsedConversationResponse = ConversationResponseSchema.safeParse(
          await conversationResponse.json()
        );
        if (!parsedConversationResponse.success) {
          throw new Error('Invalid simulation response payload');
        }
        const { conversation: updatedConversation, user: updatedUser } =
          parsedConversationResponse.data;
        const newSimulateId = parsedConversationResponse.data.id;
        setCurrentSimulateId(newSimulateId);
        router.replace(`/outline/${outlineId}/simulate/${newSimulateId}`);
        setConversation(updatedConversation);
        setTokenCount(updatedUser.chatTokens);
        setIsLocalLoading(false);
        return parsedConversationResponse.data;
      } else {
        const response = await fetch(`/api/simulate/${simulateId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch conversation: ${response.status}`);
        }
        const parsedConversationResponse = ConversationResponseSchema.safeParse(
          await response.json()
        );
        if (!parsedConversationResponse.success) {
          throw new Error('Invalid conversation payload');
        }
        const data = parsedConversationResponse.data;
        setCurrentSimulateId(data.id);
        setConversation(data.conversation);
        setTokenCount(data.user.chatTokens);
        setIsLocalLoading(false);
        return data;
      }
    },
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const handleSubmit = useCallback(
    async (userMessage: UserMessage) => {
      setIsSaving(true);
      if (!user || tokenCount <= 0) {
        setTokenCount(0);
        setIsSaving(false);
        return;
      }
      if (currentSimulateId === null) {
        setIsSaving(false);
        return;
      }
      try {
        const conversationResponse = await fetch('/api/simulate/converse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            simulateId: currentSimulateId,
            input: userMessage.content,
            conversation: conversation,
          }),
        });
        if (!conversationResponse.ok) {
          throw new Error(`Failed to get response from AI: ${conversationResponse.status}`);
        }
        const parsedConversationResponse = ConversationResponseSchema.safeParse(
          await conversationResponse.json()
        );
        if (!parsedConversationResponse.success) {
          throw new Error('Invalid simulation response payload');
        }
        const { conversation: updatedConversation, user: updatedUser } =
          parsedConversationResponse.data;
        setConversation(updatedConversation);
        setTokenCount(updatedUser.chatTokens);
        setUserMessage(userMessageInit);
        setIsSaving(false);
        return parsedConversationResponse.data;
      } catch (error) {
        console.error('Failed to get response from AI or update conversation:', error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [conversation, currentSimulateId, setConversation, setUserMessage, tokenCount, user]
  );

  useEffect(() => {
    setCurrentSimulateId(simulateId);
  }, [simulateId]);

  useEffect(() => {
    if (!embla) {
      return;
    }

    const scrollToLatestMessage = () => {
      embla.scrollTo(Math.max(conversation.length - 1, 0));
    };

    embla.on('init', scrollToLatestMessage);
    embla.on('slidesChanged', scrollToLatestMessage);
    scrollToLatestMessage();

    return () => {
      embla.off('init', scrollToLatestMessage);
      embla.off('slidesChanged', scrollToLatestMessage);
    };
  }, [embla, conversation.length]);

  if (isLoading || isLocalLoading) {
    return (
      <div className={cn(`flex h-screen w-full flex-col items-center rounded-none p-16`)}>
        <span className={cn(`loading loading-spinner loading-lg`)}></span>
      </div>
    );
  }

  if (error) {
    return (
      <GenericError
        error={error}
        reset={() => {
          return;
        }}
      />
    );
  }

  return (
    <Carousel
      setApi={setEmbla}
      className={cn(`h-full max-w-full`)}
    >
      <div className={cn(`flex max-h-full min-h-0 flex-col pb-4 select-none`)}>
        <CarouselContent>
          {conversation.map((message, index) =>
            message.role === 'assistant' ? (
              <CarouselItem
                key={index}
                className={cn(`basis-full pb-4`)}
              >
                <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 px-4`)}>
                  {message.role === 'assistant' ? (
                    <div className={cn(`mx-auto flex flex-col gap-6 px-4 py-8 max-sm:px-0`)}>
                      <h3 className={cn(`text-2xl font-bold`)}>{message.content.headline}</h3>

                      <div className={cn(`flex flex-col gap-4`)}>
                        {message.content.narration?.map((narration) => (
                          <p key={narration}>{narration}</p>
                        ))}
                      </div>
                      <Separator className={cn(`border-base-300 my-2`)} />
                      <p className={cn(`text-lg font-bold`)}>{message.content.prompt || ''}</p>
                      <ChatOptions
                        options={message.content.options || []}
                        index={index}
                        disabled={index !== conversation.length - 1}
                      />
                      <Button
                        disabled={
                          isSaving ||
                          index !== conversation.length - 1 ||
                          tokenCount <= 0 ||
                          currentSimulateId === null
                        }
                        onClick={() => handleSubmit(userMessage)}
                        className={cn(
                          `ring-offset-base-300 bg-indigo-600 ring-indigo-500 ring-offset-2 transition-all duration-100 ease-in-out outline-none hover:bg-indigo-600 hover:brightness-90 focus:ring-2 disabled:bg-indigo-600/30 max-sm:mx-1`
                        )}
                      >
                        {isSaving ? (
                          <span className={cn(`flex items-center gap-2`)}>
                            <Sparkles
                              aria-hidden={true}
                              className={cn(`size-5 animate-spin`)}
                            />
                            Thinking
                          </span>
                        ) : index !== conversation.length - 1 ? (
                          <span className={cn(`flex items-center gap-2`)}>
                            <Check
                              aria-hidden={true}
                              className={cn(`size-5`)}
                            />{' '}
                            Done
                          </span>
                        ) : (
                          <span className={cn(`flex items-center gap-2`)}>
                            <Sparkles
                              aria-hidden={true}
                              className={cn(`size-5`)}
                            />
                            Send
                            <span
                              className={cn(
                                `bg-base-200/50 flex items-center gap-1 rounded-md px-2 py-1 text-xs`,
                                tokenCount > 10 ? 'text-success' : 'text-error'
                              )}
                            >
                              {tokenCount}
                              <Coins
                                aria-hidden={true}
                                className={cn(`size-3`)}
                              />
                              {conversation.length / 20 > 1 && (
                                <span className={cn(`text-base-content`)}>
                                  (Cost: {Math.ceil(conversation.length / 20)})
                                </span>
                              )}
                            </span>
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
        <div className={cn(`relative h-16 shrink-0 border-t-2 border-[#302a2a]`)}>
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
        </div>
      </div>
    </Carousel>
  );
};
const Chat = React.memo(ChatComponent);
Chat.displayName = 'Chat';
export default Chat;
