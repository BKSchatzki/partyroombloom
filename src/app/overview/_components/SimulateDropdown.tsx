import React from 'react';

import dayjs from 'dayjs';
import {
  ArrowRight,
  ChevronDown,
  Coins,
  Sparkle,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SimulateDropdownProps {
  outline: Outline;
  tokenCount: number;
}

const SimulateDropdown: React.FC<SimulateDropdownProps> = ({ outline, tokenCount }) => {
  return outline.conversations.length === 0 ? (
    <Link
      href={`/outline/${outline.id}/simulate`}
      role={`none`}
      tabIndex={-1}
      className={cn(`col-span-12 sm:col-span-4`)}
    >
      <Button
        color={`ghost`}
        disabled={tokenCount <= 0}
        role={`link`}
        size={`block`}
        className={cn(
          `max-w-full border border-indigo-700 bg-indigo-600 font-semibold text-base-content outline-none ring-indigo-500 ring-offset-2 ring-offset-base-300 transition-all duration-100 ease-in-out hover:bg-indigo-600 hover:brightness-90 focus:ring-2 disabled:bg-indigo-600/30`
        )}
      >
        <Sparkle
          aria-hidden={true}
          className={cn(`size-5`)}
        />
        Simulate Scene
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
        </span>
      </Button>
    </Link>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          `col-span-12 flex min-h-12 max-w-full items-center justify-center gap-2 rounded-3xl border border-indigo-700 bg-indigo-600 font-semibold text-base-content outline-none ring-indigo-500 ring-offset-2 ring-offset-base-300 transition-all duration-100 ease-in-out hover:bg-indigo-600 hover:brightness-90 focus:ring-2 disabled:bg-indigo-600/30 sm:col-span-4`
        )}
      >
        <ChevronDown
          aria-hidden={true}
          className={cn(`size-5`)}
        />
        Select Simulation
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn(`flex flex-col gap-2 rounded-2xl bg-base-300`)}>
        <DropdownMenuItem
          asChild
          disabled={tokenCount <= 0}
          className={cn(
            `cursor-pointer rounded-xl bg-indigo-600/30 p-0 font-semibold hover:bg-indigo-600 focus:bg-indigo-600`
          )}
        >
          <Link
            href={`/outline/${outline.id}/simulate`}
            className={cn(`flex w-full items-center gap-2 p-4 text-lg`)}
          >
            <Sparkle
              aria-hidden={true}
              className={cn(`size-5`)}
            />
            New Simulation
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
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className={cn(`-my-0.5`)} />
        {outline.conversations.map((conversation) => (
          <DropdownMenuItem
            asChild
            key={conversation.createdAt}
            className={cn(
              `cursor-pointer rounded-xl bg-indigo-600/10 p-0 font-semibold hover:bg-indigo-600 focus:bg-indigo-600`
            )}
          >
            <Link
              href={`/outline/${outline.id}/simulate/${conversation.id}`}
              className={cn(`flex w-full items-center gap-2 p-4`)}
            >
              <ArrowRight
                aria-hidden={true}
                className={cn(`size-4`)}
              />
              {dayjs(conversation.createdAt).format('ddd MMM D, YYYY - h:mm A')}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SimulateDropdown;
