'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useAtom } from 'jotai';
import { User } from 'lucia';
import {
  Check,
  Coins,
  Sparkles,
} from 'lucide-react';
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

interface ChatProps {
  outlineId: string | null;
  simulateId: number | null;
  user: User | null;
}

const ChatComponent: React.FC<ChatProps> = ({ outlineId, simulateId, user }) => {
  const [tokenCount, setTokenCount] = useState(user ? user.chatTokens : 0);
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
      if (simulateId === null) {
        if (!user || tokenCount <= 0) {
          setTokenCount(0);
          router.push('/overview');
          return tokenCount;
        }
        const createResponse = await fetch('/api/simulate/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ outline }),
        });
        if (!createResponse.ok) {
          throw new Error(`Failed to create conversation: ${createResponse.status}`);
        }
        const { id: newSimulateId } = await createResponse.json();
        const conversationResponse = await fetch('/api/simulate/converse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: outline,
            conversation: [],
          }),
        });
        if (!conversationResponse.ok) {
          throw new Error(`Failed to fetch conversation: ${conversationResponse.status}`);
        }
        const { conversation: updatedConversation, user: updatedUser } =
          await conversationResponse.json();
        const updatedResponse = await fetch(`/api/simulate/${newSimulateId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversation: updatedConversation }),
        });
        if (!updatedResponse.ok) {
          throw new Error(`Failed to update conversation: ${updatedResponse.status}`);
        }
        const data = await updatedResponse.json();
        router.replace(`/outline/${outlineId}/simulate/${newSimulateId}`);
        setConversation(updatedConversation);
        setTokenCount(updatedUser.chatTokens);
        setIsLocalLoading(false);
        return data;
      } else {
        const response = await fetch(`/api/simulate/${simulateId}`);
        const data = await response.json();
        setConversation(data.conversation);
        setTokenCount(data.user.chatTokens);
        setIsLocalLoading(false);
        return data;
      }
    },
  });

  const handleSubmit = useCallback(
    async (userMessage: UserMessage) => {
      setIsSaving(true);
      if (!user || tokenCount <= 0) {
        setTokenCount(0);
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
            input: userMessage.content,
            conversation: conversation,
          }),
        });
        if (!conversationResponse.ok) {
          throw new Error(`Failed to get response from AI: ${conversationResponse.status}`);
        }
        const { conversation: updatedConversation, user: updatedUser } =
          await conversationResponse.json();
        const updatedResponse = await fetch(`/api/simulate/${simulateId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversation: updatedConversation }),
        });
        if (!updatedResponse.ok) {
          throw new Error(`Failed to update conversation: ${updatedResponse.status}`);
        }
        const data = await updatedResponse.json();
        setConversation(updatedConversation);
        setTokenCount(updatedUser.chatTokens);
        setUserMessage(userMessageInit);
        setIsSaving(false);
        return data;
      } catch (error) {
        console.error('Failed to get response from AI or update conversation:', error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [conversation, setConversation, setUserMessage, simulateId, tokenCount, user]
  );

  useEffect(() => {
    if (!embla) {
      return;
    }
    embla.scrollTo(conversation.length - 1);
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
      <div className={cn(`flex max-h-full select-none flex-col pb-4`)}>
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
                      <Separator className={cn(`my-2 border-base-300`)} />
                      <p className={cn(`text-lg font-bold`)}>{message.content.prompt || ''}</p>
                      <ChatOptions
                        options={message.content.options || []}
                        index={index}
                        disabled={index !== conversation.length - 1}
                      />
                      <Button
                        disabled={isSaving || index !== conversation.length - 1 || tokenCount <= 0}
                        onClick={() => handleSubmit(userMessage)}
                        className={cn(
                          `bg-indigo-600 outline-none ring-indigo-500 ring-offset-2 ring-offset-base-300 transition-all duration-100 ease-in-out hover:bg-indigo-600 hover:brightness-90 focus:ring-2 disabled:bg-indigo-600/30 max-sm:mx-1`
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
                                `flex items-center gap-1 rounded-md bg-base-200/50 px-2 py-1 text-xs`,
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
        <div className={cn(`relative h-16 border-t-2 border-[#302a2a]`)}>
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
