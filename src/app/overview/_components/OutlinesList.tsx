'use client';

import React, { useCallback, useState } from 'react';

import { useAtom } from 'jotai';
import type { User } from '@/lib/auth';
import { ChevronDown, Leaf, Pencil } from 'lucide-react';
import Link from 'next/link';

import DeleteButton from '@/components/DeleteButton';
import GenericError from '@/components/GenericError';
import ManageDropdown from '@/components/ManageDropdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { outlinesListAtom } from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

import Preview from './Preview';
import SimulateDropdown from './SimulateDropdown';

interface OutlinesListProps {
  user: User;
}

const OutlinesListComponent: React.FC<OutlinesListProps> = ({ user }) => {
  const [outlinesList, setOutlinesList] = useAtom<Outline[]>(outlinesListAtom);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const { isLoading, error } = useQuery({
    queryKey: ['outlinesList'],
    queryFn: async () => {
      const response = await fetch('/api/outline');
      if (!response.ok) {
        throw new Error(`Failed to fetch outlines: ${response.status}`);
      }
      const data = await response.json();
      setIsLocalLoading(false);
      setOutlinesList(data);
      return data;
    },
  });

  const handleDelete = useCallback(
    async (outlineId: number) => {
      try {
        const response = await fetch(`/api/outline/${outlineId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        setOutlinesList((prevOutlines) =>
          prevOutlines.filter((outline) => outline.id !== outlineId)
        );
      } catch (error) {
        console.error('Error deleting outline:', error);
      }
    },
    [setOutlinesList]
  );

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
    <ScrollArea className={cn(`flex h-full w-full flex-col gap-4 sm:px-4`)}>
      <Link
        href={`/outline/new`}
        className={cn(`mt-4 mb-4 block w-full px-4 outline-none`)}
        tabIndex={-1}
      >
        <button
          className={cn(
            `bg-secondary/10 ring-secondary ring-offset-base-300 hover:bg-secondary/20 flex h-[136px] w-full flex-row items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#64d8b4] text-2xl text-balance text-[#64d8b4] ring-offset-2 transition-all duration-100 ease-in-out outline-none hover:brightness-125 focus:ring-2`
          )}
        >
          <Leaf
            aria-hidden={true}
            className={cn(`size-7`)}
          />
          New Outline
        </button>
      </Link>
      {isLoading || isLocalLoading ? (
        <div
          className={cn(
            `flex h-[calc(100vh-14.5rem)] w-full flex-col items-center rounded-none p-16`
          )}
        >
          <span className={cn(`loading loading-spinner loading-lg`)}></span>
        </div>
      ) : (
        <Accordion
          type={`single`}
          collapsible={true}
          className={cn(`border-base-300 border-t-2 pt-4`)}
        >
          {outlinesList.map((outline) => (
            <Card
              key={outline.id}
              className={cn(
                `bg-neutral/50 shadow-base-300 relative mb-6 w-full p-0 shadow-xl transition-all duration-100 ease-in-out max-sm:rounded-none`
              )}
            >
              <AccordionItem value={`${outline.id}`}>
                <AccordionTrigger
                  iconSize={7}
                  className={cn(
                    `ring-secondary rounded-2xl outline-none ring-inset focus:ring-2 data-[state=open]:rounded-b-none max-sm:rounded-none`
                  )}
                >
                  <span
                    className={cn(
                      `flex w-full shrink-0 gap-2 p-4 pe-12 text-2xl text-balance text-[#64d8b4] hover:brightness-125 max-sm:flex-col sm:basis-1/3 sm:gap-4`,
                      !outline.title && `italic opacity-30`
                    )}
                  >
                    {outline.title || 'Untitled Scene'}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={cn(`border-base-300 flex flex-col gap-2 border-t-2 p-4`)}>
                    <span className={cn(!outline.description && `italic opacity-30`)}>
                      <span className={cn(`font-semibold text-[#64d8b4]`)}>Description: </span>
                      {outline.description || 'A short description to set the scene.'}
                    </span>
                    <span className={cn(!outline.goal && `italic opacity-30`)}>
                      <span className={cn(`font-semibold text-[#64d8b4]`)}>Goal: </span>
                      {outline.goal || 'What this scene does or where it leads.'}
                    </span>
                    <span className={cn(!outline.comments && `italic opacity-30`)}>
                      <span className={cn(`font-semibold text-[#64d8b4]`)}>Comments: </span>
                      {outline.comments || 'Extra information to help the Simulator or Future You.'}
                    </span>
                  </div>
                  <div className={cn(`border-base-300/30 grid grid-cols-12 gap-4 border-t-2 p-4`)}>
                    <div className={cn(`col-span-12 sm:col-span-3`)}>
                      <DeleteButton
                        block={true}
                        handleDelete={() => handleDelete(outline.id as number)}
                        item={outline.title || 'this Outline'}
                        message={`Delete Outline`}
                      />
                    </div>
                    <Link
                      href={`/outline/${outline.id}`}
                      tabIndex={-1}
                      role={`none`}
                      className={cn(`col-span-12 sm:col-span-3`)}
                    >
                      <Button
                        color={`secondary`}
                        role={`link`}
                        size={`block`}
                        className={cn(`max-w-full`)}
                      >
                        <Pencil
                          aria-hidden={true}
                          className={cn(`size-5`)}
                        />
                        Edit Outline
                      </Button>
                    </Link>
                    <SimulateDropdown
                      outline={outline}
                      tokenCount={user.chatTokens}
                    />
                    <ManageDropdown
                      outline={outline}
                      setOutline={null}
                    >
                      <ChevronDown
                        aria-hidden={true}
                        className={cn(`size-5`)}
                      />
                      Manage
                    </ManageDropdown>
                  </div>
                  <Preview outline={outline} />
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
      )}
    </ScrollArea>
  );
};

const OutlinesList = React.memo(OutlinesListComponent);

OutlinesList.displayName = 'OutlinesList';

export default OutlinesList;
