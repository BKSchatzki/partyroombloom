'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import { useAtom } from 'jotai';
import Link from 'next/link';

import DeleteButton from '@/components/DeleteButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { outlinesListAtom } from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

const OutlinesList = () => {
  const [outlinesList, setOutlinesList] = useAtom<Outline[]>(outlinesListAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutlines = async () => {
      try {
        const response = await fetch('/api/outline');
        if (!response.ok) {
          throw new Error(`Failed to fetch outlines: ${response.status}`);
        }
        const data = await response.json();
        setOutlinesList(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOutlines();
  }, [setOutlinesList]);

  const handleDelete = async (outlineId: number) => {
    setIsSaving(true);
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
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollArea className={cn(`flex h-full w-full flex-col gap-4 p-4`)}>
      {outlinesList.map((outline) => (
        <Card
          key={outline.id}
          className={cn(
            `relative mb-6 bg-neutral/50 shadow-xl shadow-base-300 transition-all duration-100 ease-in-out hover:brightness-125`
          )}
        >
          <DeleteButton
            first={true}
            handleDelete={() => handleDelete(outline.id as number)}
            item={outline.title}
            message={`Delete Outline ${outline.title}`}
          />
          <Link
            href={`/outline/${outline.id}`}
            className={cn(`flex flex-col gap-2 p-4`)}
          >
            <CardHeader>
              <CardTitle
                className={cn(`text-3xl text-[#64d8b4]`, !outline.title && `italic opacity-30`)}
              >
                {outline.title || 'Untitled Scene'}
              </CardTitle>
              <CardDescription className={cn(!outline.description && `italic opacity-30`)}>
                {outline.description || 'A short description to set the scene.'}
              </CardDescription>
            </CardHeader>
            <Separator className={cn(`my-0 border-base-300`)} />
            <CardContent className={cn(`flex flex-col gap-4`)}>
              <span className={cn(!outline.goal && `italic opacity-30`)}>
                {outline.goal || 'What this scene does or where it leads.'}
              </span>
              <span className={cn(!outline.comments && `italic opacity-30`)}>
                {outline.comments || 'Extra information to help the Simulator or Future You.'}
              </span>
            </CardContent>
          </Link>
        </Card>
      ))}
    </ScrollArea>
  );
};

export default OutlinesList;
