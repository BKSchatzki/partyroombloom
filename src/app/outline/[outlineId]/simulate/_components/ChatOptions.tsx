'use client';

import React from 'react';

import { useAtom } from 'jotai';
import { Dices } from 'lucide-react';

import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  conversationAtom,
  userMessageAtom,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';

const ChatOptions = ({
  prompt,
  options,
  index,
  disabled,
}: {
  prompt: string;
  options: Array<any>;
  index: number;
  disabled: boolean;
}) => {
  const [userMessage, setUserMessage] = useAtom(userMessageAtom);
  const [conversation, setConversation] = useAtom(conversationAtom);

  const rolls = [
    'Critical Success',
    'Normal Success',
    'Close Success',
    'Close Failure',
    'Normal Failure',
    'Critical Failure',
  ];

  const handleChange = (property: string, value: string) => {
    setUserMessage((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [property]: value,
      },
    }));
  };

  return (
    <div className={cn(`flex flex-col gap-4`)}>
      <p className={cn(`text-lg font-bold`)}>{prompt}</p>
      <RadioGroup
        value={
          index !== conversation.length - 1
            ? conversation[index + 1].content.choice
            : userMessage.content.choice || ''
        }
        onValueChange={(value) => handleChange('choice', value)}
        className={cn(`flex flex-col gap-4`)}
      >
        {options.map((option) => (
          <div
            key={option.description}
            className={cn(`flex items-center gap-4`)}
          >
            <RadioGroupItem
              id={option.description}
              value={option.description}
              disabled={disabled}
              className={cn(`peer hidden min-h-4 min-w-4`)}
            />
            <Label
              htmlFor={option.description}
              className={cn(
                `card card-bordered card-compact min-h-16 w-full items-center justify-center gap-2 text-balance border-2 border-indigo-600/30 bg-indigo-600/10 p-4 text-indigo-300 transition-all duration-100 ease-in-out peer-aria-checked:border-indigo-600 peer-aria-checked:bg-indigo-600/30`,
                disabled ? `opacity-50` : `hover:bg-indigo-600/20`
              )}
            >
              <span>{option.description}</span>
              {option.roll && (
                <div
                  className={cn(`flex items-center justify-end gap-2 rounded-full bg-neutral ps-2`)}
                >
                  <Dices className={cn(`size-4`)} />
                  <Select
                    disabled={disabled}
                    value={
                      index !== conversation.length - 1
                        ? conversation[index + 1].content.rollResult
                        : userMessage.content.rollResult || ''
                    }
                    onValueChange={(value) => handleChange('rollResult', value)}
                  >
                    <SelectTrigger
                      className={cn(
                        `w-40 rounded-full bg-base-300 text-center scrollbar-thin scrollbar-track-warning/25 scrollbar-thumb-warning`
                      )}
                    >
                      <SelectValue placeholder={`-`} />
                    </SelectTrigger>
                    <SelectContent>
                      {rolls.map((roll, index) => (
                        <SelectItem
                          key={index}
                          value={roll.toString()}
                          className={cn(`bg-base-300`)}
                        >
                          {roll.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </Label>
          </div>
        ))}
        <div className={cn(`flex items-center gap-4`)}>
          <RadioGroupItem
            id={`thoughts`}
            value={`I just have some thoughts.`}
            disabled={disabled}
            className={cn(`peer hidden min-h-4 min-w-4`)}
          />
          <Label
            htmlFor={`thoughts`}
            className={cn(
              `card card-bordered card-compact min-h-16 w-full items-center justify-center gap-2 text-balance bg-indigo-600/10 p-4 text-indigo-300 transition-all duration-100 ease-in-out peer-aria-checked:border-2 peer-aria-checked:border-indigo-600 peer-aria-checked:bg-indigo-600/30`,
              disabled ? `opacity-50` : `hover:bg-indigo-600/20`
            )}
          >
            I just have some thoughts.
          </Label>
        </div>
      </RadioGroup>
      <Textarea
        className={cn(`no-scrollbar`)}
        disabled={disabled}
        placeholder={`Type your thoughts here...`}
        value={
          index !== conversation.length - 1
            ? conversation[index + 1].content.comments
            : userMessage.content.comments || ''
        }
        onChange={(event) => handleChange('comments', event.target.value)}
      />
    </div>
  );
};

export default ChatOptions;
