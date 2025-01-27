'use client';

import React, {
  useCallback,
  useMemo,
} from 'react';

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
import {
  Message,
  UserMessage,
} from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChatOptionsProps {
  options: Array<any>;
  index: number;
  disabled: boolean;
}

const ChatOptionsComponent: React.FC<ChatOptionsProps> = ({ options, index, disabled }) => {
  const [userMessage, setUserMessage] = useAtom(userMessageAtom);
  const [conversation] = useAtom(conversationAtom);

  const handleChange = useCallback(
    (property: string, value: string) => {
      if (
        // Check if changed property is choice and whether it has roll
        property === 'choice' &&
        options.find(
          (option: { description: string; roll: boolean }) => option.description === value
        ).roll === false
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
    },
    [options, setUserMessage]
  );

  const prevUserMessage = useMemo(
    () => conversation[index + 1] as UserMessage,
    [conversation, index]
  );

  return (
    <div className={cn(`flex flex-col gap-4 max-sm:px-1`)}>
      <RadioGroup
        value={
          disabled
            ? (prevUserMessage?.content as { choice: string }).choice
            : userMessage.content.choice || ''
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
                `card card-bordered card-compact min-h-16 w-full cursor-pointer items-center justify-center gap-2 text-balance border-2 border-indigo-600/30 bg-indigo-600/20 p-4 text-center leading-normal text-indigo-300 transition-all duration-100 ease-in-out peer-aria-checked:border-indigo-600 peer-aria-checked:bg-indigo-600/50`,
                disabled
                  ? `opacity-50`
                  : `ring-indigo-500 ring-offset-2 ring-offset-base-100 peer-focus:peer-aria-checked:ring-2 hover:bg-indigo-600/20`
              )}
            >
              {option.description}
              {!option.roll ? null : userMessage.content.choice === option.description ||
                prevUserMessage?.content.choice === option.description ? (
                <RollSelect
                  rollResult={
                    disabled ? prevUserMessage?.content.rollResult : userMessage.content.rollResult
                  }
                  handleChange={handleChange}
                  index={index}
                  prevUserMessage={prevUserMessage}
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
          disabled
            ? (prevUserMessage?.content as { comments: string }).comments
            : userMessage.content.comments || ''
        }
        onChange={(event) => handleChange('comments', event.target.value)}
      />
    </div>
  );
};
const ChatOptions = React.memo(ChatOptionsComponent);
ChatOptions.displayName = 'ChatOptions';
export default ChatOptions;

interface RollSelectProps {
  rollResult: string | null;
  handleChange: any;
  index: number;
  prevUserMessage: UserMessage | null;
  disabled: boolean;
}

const RollSelectComponent: React.FC<RollSelectProps> = ({
  rollResult,
  handleChange,
  index,
  prevUserMessage,
  disabled,
}) => {
  const [conversation] = useAtom(conversationAtom);

  const rolls = useMemo(
    () => [
      'Critical Success',
      'Normal Success',
      'Close Success',
      'Close Failure',
      'Normal Failure',
      'Critical Failure',
    ],
    []
  );

  return (
    <div
      className={cn(
        `flex items-center justify-end gap-2 rounded-full bg-warning/50 p-0.5 ps-2 ring-warning/75 ring-offset-2 ring-offset-base-300 has-[:focus]:ring-2`
      )}
    >
      <Dices
        aria-hidden={true}
        className={cn(`size-5`)}
      />
      <Select
        disabled={disabled}
        value={
          index !== conversation.length - 1
            ? (prevUserMessage?.content as { rollResult: string | null }).rollResult || ''
            : rollResult || ''
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
};
const RollSelect = React.memo(RollSelectComponent);
RollSelect.displayName = 'RollSelect';
