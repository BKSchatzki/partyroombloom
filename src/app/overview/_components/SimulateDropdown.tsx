import React, { useCallback, useState } from 'react';

import dayjs from 'dayjs';
import { ArrowRight, ChevronDown, Coins, Sparkle } from 'lucide-react';
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

const SimulateDropdownComponent: React.FC<SimulateDropdownProps> = ({ outline, tokenCount }) => {
  const [open, setOpen] = useState(false);
  const handleTriggerPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!open) {
        return;
      }

      event.preventDefault();
      setOpen(false);
    },
    [open]
  );

  return outline.conversations.length === 0 ? (
    <Link
      href={`/outline/${outline.id}/simulate`}
      role={`none`}
      tabIndex={-1}
      className={cn(`col-span-12 sm:col-span-3`)}
    >
      <Button
        color={`ghost`}
        disabled={tokenCount <= 0}
        role={`link`}
        size={`block`}
        className={cn(
          `text-base-content ring-offset-base-300 h-10 min-h-10 max-w-full rounded-3xl border border-indigo-700 bg-indigo-600 px-4 text-sm font-semibold ring-indigo-500 ring-offset-2 transition-all duration-100 ease-in-out outline-none hover:border-indigo-700 hover:bg-indigo-600 hover:brightness-90 focus:ring-2 active:border-indigo-700 active:bg-indigo-600 disabled:bg-indigo-600/30`
        )}
      >
        <Sparkle
          aria-hidden={true}
          className={cn(`size-5`)}
        />
        Simulate
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
        </span>
      </Button>
    </Link>
  ) : (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          type={`button`}
          color={`ghost`}
          size={`block`}
          onPointerDown={handleTriggerPointerDown}
          className={cn(
            `text-base-content ring-offset-base-300 col-span-12 h-10 min-h-10 max-w-full rounded-3xl border border-indigo-700 bg-indigo-600 px-4 text-sm font-semibold ring-indigo-500 ring-offset-2 transition-all duration-100 ease-in-out outline-none hover:border-indigo-700 hover:bg-indigo-600 hover:brightness-90 focus:ring-2 active:border-indigo-700 active:bg-indigo-600 disabled:bg-indigo-600/30 sm:col-span-3`
          )}
        >
          <ChevronDown
            aria-hidden={true}
            className={cn(`size-5`)}
          />
          Select Simulation
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn(`bg-base-300 flex flex-col gap-2 rounded-2xl`)}>
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
                `bg-base-200/50 flex items-center gap-1 rounded-md px-2 py-1 text-xs`,
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

const SimulateDropdown = React.memo(SimulateDropdownComponent);

SimulateDropdown.displayName = 'SimulateDropdown';

export default SimulateDropdown;
