'use client';

import React from 'react';

import { Dices } from 'lucide-react';
import { z } from 'zod';

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
import { cn } from '@/lib/utils';
import { mockStructuredChat } from '@/mock/mockStructuredChat';

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
  const rolls = [
    'Critical Failure',
    'Normal Failure',
    'Close Failure',
    'Close Success',
    'Normal Success',
    'Critical Success',
  ];

  return (
    <div className={cn(`flex flex-col gap-4`)}>
      <p className={cn(`text-lg font-bold`)}>{prompt}</p>
      <RadioGroup
        defaultValue={mockStructuredChat[index + 1]?.content.choice || 'I just have some thoughts.'}
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
              className={cn(`min-h-4 min-w-4`)}
            />
            <Label
              htmlFor={option.description}
              className={cn(
                `flex min-h-8 flex-wrap items-center gap-2 ${disabled ? `opacity-50` : ``}`
              )}
            >
              <span>{option.description}</span>
              {option.roll && (
                <div
                  className={cn(`flex items-center justify-end gap-2 rounded-full bg-neutral ps-2`)}
                >
                  <Dices className={cn(`size-4`)} />
                  <span>{option.roll?.skill}</span>
                  <span>{option.roll?.attribute}</span>
                  <Select disabled={disabled}>
                    <SelectTrigger
                      className={cn(
                        `w-20 rounded-full bg-base-300 text-center scrollbar-thin scrollbar-track-warning/25 scrollbar-thumb-warning`
                      )}
                    >
                      <SelectValue
                        placeholder={
                          mockStructuredChat[index + 1]?.content.rollResult?.toString() || `-`
                        }
                      />
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
            id={`default`}
            value={`I just have some thoughts.`}
            disabled={disabled}
          />
          <Label
            htmlFor={`default`}
            className={cn(`flex min-h-8 items-center gap-2 ${disabled ? `opacity-50` : ``}`)}
          >
            I just have some thoughts.
          </Label>
        </div>
      </RadioGroup>
      <Textarea
        className={cn(`no-scrollbar`)}
        disabled={disabled}
        placeholder={`Type your thoughts here...`}
        value={mockStructuredChat[index + 1]?.content.comments || ''}
      />
    </div>
  );
};

export default ChatOptions;
