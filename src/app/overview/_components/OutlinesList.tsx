'use client';

import { useAtom } from 'jotai';
import {
  Leaf,
  Pencil,
  Plus,
  Sparkle,
  Theater,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

import DeleteButton from '@/components/DeleteButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { outlinesListAtom } from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

import Preview from './Preview';

const OutlinesList = () => {
  const [outlinesList, setOutlinesList] = useAtom<Outline[]>(outlinesListAtom);

  const { isLoading, error } = useQuery({
    queryKey: ['outlinesList'],
    queryFn: async () => {
      const response = await fetch('/api/outline');
      if (!response.ok) {
        throw new Error(`Failed to fetch outlines: ${response.status}`);
      }
      const data = await response.json();
      setOutlinesList(data);
      return data;
    },
  });

  const handleDelete = async (outlineId: number) => {
    try {
      const response = await fetch(`/api/outline/${outlineId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      setOutlinesList(outlinesList.filter((outline) => outline.id !== outlineId));
    } catch (error) {
      console.error('Error deleting outline:', error);
    }
  };

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <ScrollArea className={cn(`flex h-full w-full flex-col gap-4 pt-4 sm:px-4`)}>
      <Link
        href={`/outline`}
        className={cn(`mb-4 block h-full w-full`)}
      >
        <Card
          className={cn(
            `flex h-[136px] w-full flex-row items-center justify-center gap-2 text-balance border-2 border-dashed border-[#64d8b4] bg-secondary/10 text-2xl text-[#64d8b4] transition-all duration-100 ease-in-out hover:bg-secondary/20 hover:brightness-125`
          )}
        >
          <Leaf className={cn(`size-7`)} />
          New Outline
        </Card>
      </Link>
      {isLoading ? (
        <Skeleton className={cn(`flex h-screen w-full flex-col items-center p-8`)}>
          <span className="loading loading-spinner loading-lg"></span>
        </Skeleton>
      ) : (
        <Accordion
          type={`single`}
          collapsible={true}
          className={cn(`border-t-2 border-base-300 pt-4`)}
        >
          {outlinesList.map((outline) => (
            <Card
              key={outline.id}
              className={cn(
                `relative mb-6 w-full bg-neutral/50 p-0 shadow-xl shadow-base-300 transition-all duration-100 ease-in-out max-sm:rounded-none`
              )}
            >
              <AccordionItem
                key={outline.id}
                value={`${outline.id}`}
              >
                <AccordionTrigger iconSize={9}>
                  <span
                    className={cn(
                      `flex w-full shrink-0 gap-2 text-balance p-4 text-3xl text-[#64d8b4] hover:brightness-125 max-sm:flex-col sm:basis-1/3 sm:gap-4`,
                      !outline.title && `italic opacity-30`
                    )}
                  >
                    {outline.title || 'Untitled Scene'}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={cn(`flex flex-col gap-2 border-t-2 border-base-300 p-4`)}>
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
                  <div className={cn(`grid grid-cols-12 gap-4 border-t-2 border-base-300/30 p-4`)}>
                    <div className={cn(`col-span-12 sm:col-span-4`)}>
                      <DeleteButton
                        block={true}
                        handleDelete={() => handleDelete(outline.id as number)}
                        item={outline.title || 'this Outline'}
                        message={`Delete Outline`}
                      />
                    </div>
                    <Link
                      href={`/outline/${outline.id}`}
                      className={cn(`col-span-12 sm:col-span-4`)}
                    >
                      <Button
                        color={`secondary`}
                        size={`block`}
                        className={cn(`max-w-full`)}
                      >
                        <Pencil className={cn(`size-5`)} />
                        Edit Outline
                      </Button>
                    </Link>
                    <Link
                      href={`/outline/${outline.id}`}
                      className={cn(`col-span-12 sm:col-span-4`)}
                    >
                      <Button
                        color={`primary`}
                        size={`block`}
                        className={cn(`max-w-full`)}
                      >
                        <Sparkle className={cn(`size-5`)} />
                        Simulate Scene
                      </Button>
                    </Link>
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

export default OutlinesList;
