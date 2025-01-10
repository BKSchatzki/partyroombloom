'use client';

import React, { useCallback } from 'react';

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
  options,
  index,
  disabled,
}: {
  options: Array<any>;
  index: number;
  disabled: boolean;
}) => {
  const [userMessage, setUserMessage] = useAtom(userMessageAtom);
  const [conversation] = useAtom(conversationAtom);

  const handleChange = (property: string, value: string) => {
    if (
      // Check if changed property is choice and whether it has roll
      property === 'choice' &&
      options.find((option: { description: string; roll: boolean }) => option.description === value)
        .roll === false
    ) {
      // If true, update value of current property and reset rollResult value to null
      setUserMessage((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          [property]: value,
          rollResult: null,
        },
      }));
      return;
    } else {
      // Otherwise, just update value of current property
      setUserMessage((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          [property]: value,
        },
      }));
      return;
    }
  };

  return (
    <div className={cn(`flex flex-col gap-4`)}>
      <RadioGroup
        value={
          disabled ? conversation[index + 1]?.content.choice : userMessage.content.choice || ''
        }
        onValueChange={(value) => handleChange('choice', value)}
        className={cn(`flex flex-col gap-4 rounded-2xl`)}
      >
        {options.map((option) => (
          <div key={option.description}>
            <RadioGroupItem
              id={option.description}
              value={option.description}
              disabled={disabled}
              className={cn(`peer sr-only min-h-4 min-w-4`)}
            />
            <Label
              htmlFor={option.description}
              className={cn(
                `card card-bordered card-compact min-h-16 w-full cursor-pointer items-center justify-center gap-2 border-2 border-indigo-600/30 bg-indigo-600/20 p-4 leading-normal text-indigo-300 transition-all duration-100 ease-in-out peer-aria-checked:border-indigo-600 peer-aria-checked:bg-indigo-600/50`,
                disabled
                  ? `opacity-50`
                  : `ring-indigo-500 ring-offset-2 ring-offset-base-100 peer-focus:peer-aria-checked:ring-2 hover:bg-indigo-600/20`
              )}
            >
              {option.description}
              {!option.roll ? null : userMessage.content.choice === option.description ||
                conversation[index + 1]?.content.choice === option.description ? (
                <RollSelect
                  rollResult={
                    disabled
                      ? conversation[index + 1]?.content.rollResult
                      : userMessage.content.rollResult
                  }
                  handleChange={handleChange}
                  index={index}
                  disabled={disabled}
                />
              ) : null}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <Textarea
        className={cn(`no-scrollbar`)}
        disabled={disabled}
        placeholder={`Type your thoughts here...`}
        value={
          disabled ? conversation[index + 1]?.content.comments : userMessage.content.comments || ''
        }
        onChange={(event) => handleChange('comments', event.target.value)}
      />
    </div>
  );
};

function RollSelect({
  rollResult,
  handleChange,
  index,
  disabled,
}: {
  rollResult: string | null;
  handleChange: any;
  index: number;
  disabled: boolean;
}) {
  const [conversation] = useAtom(conversationAtom);

  const rolls = [
    'Critical Success',
    'Normal Success',
    'Close Success',
    'Close Failure',
    'Normal Failure',
    'Critical Failure',
  ];

  return (
    <div
      className={cn(
        `flex items-center justify-end gap-2 rounded-full bg-warning/50 p-0.5 ps-2 ring-warning/75 ring-offset-2 ring-offset-base-300 has-[:focus]:ring-2`
      )}
    >
      <Dices className={cn(`size-4`)} />
      <Select
        disabled={disabled}
        value={
          index !== conversation.length - 1
            ? conversation[index + 1].content.rollResult || ''
            : rollResult
        }
        onValueChange={(value) => handleChange('rollResult', value)}
      >
        <SelectTrigger
          className={cn(
            `w-40 rounded-full bg-base-300 text-center text-base-content scrollbar-thin scrollbar-track-warning/25 scrollbar-thumb-warning`
          )}
        >
          <SelectValue placeholder={`-`} />
        </SelectTrigger>
        <SelectContent>
          {rolls.map((roll: string, index: number) => (
            <SelectItem
              key={index}
              value={roll}
              className={cn(`bg-base-300`)}
            >
              {roll}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default ChatOptions;
