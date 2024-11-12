'use client';

import { useState } from 'react';

import { useAtom } from 'jotai';
import { Plus } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { outlinesListAtom } from '@/lib/atoms';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

const OutlinesList = () => {
  const [outlinesList, setOutlinesList] = useAtom<Outline[]>(outlinesListAtom);
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();

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

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlinesList'] });
    },
  });

  if (isLoading) {
    return (
      <div className={cn(`flex h-full w-full flex-col gap-4 p-4`)}>
        <Skeleton className={cn(`flex h-80 w-full flex-col items-center justify-center`)}>
          <span className="loading loading-spinner loading-lg"></span>
        </Skeleton>
        <Skeleton className={cn(`flex h-80 w-full flex-col items-center justify-center`)}>
          <span className="loading loading-spinner loading-lg"></span>
        </Skeleton>
        <Skeleton className={cn(`flex h-80 w-full flex-col items-center justify-center`)}>
          <span className="loading loading-spinner loading-lg"></span>
        </Skeleton>
      </div>
    );
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  if (outlinesList.length === 0) {
    return (
      <div className={cn(`flex h-full w-full flex-col items-center justify-center p-4`)}>
        <Card
          className={cn(
            `bg-base-200 flex max-w-80 text-balance border-none text-center transition-all duration-100 ease-in-out hover:brightness-[115%]`
          )}
        >
          <Link
            href={`/outline`}
            className={cn(`flex flex-col items-center justify-center gap-2 p-6`)}
          >
            <h1 className={cn(`text-3xl`)}>No Outlines Found</h1>
            <Plus
              size={160}
              className={cn(`text-4xl`)}
            />
            <p className={cn(`text-xl`)}>Create a new Outline to get started.</p>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <ScrollArea className={cn(`flex h-full w-full flex-col gap-4 p-4`)}>
      {outlinesList.map((outline) => (
        <Card
          key={outline.id}
          className={cn(
            `relative mb-6 bg-neutral/50 shadow-xl shadow-base-300 transition-all duration-100 ease-in-out hover:brightness-125 max-sm:rounded-tr-none`
          )}
        >
          <DeleteButton
            first={true}
            handleDelete={() => handleDelete(outline.id as number)}
            item={outline.title || 'this Outline'}
            message={`Delete Outline ${outline.title}`}
          />
          <Link
            href={`/outline/${outline.id}`}
            className={cn(`flex flex-col gap-2 p-4`)}
          >
            <CardHeader className={cn(`p-0`)}>
              <CardTitle
                className={cn(`text-3xl text-[#64d8b4]`, !outline.title && `italic opacity-30`)}
              >
                {outline.title || 'Untitled Scene'}
              </CardTitle>
              <CardDescription
                className={cn(`text-base-content/75`, !outline.description && `italic opacity-30`)}
              >
                {outline.description || 'A short description to set the scene.'}
              </CardDescription>
            </CardHeader>
            <Separator className={cn(`mt-0 border-base-300`)} />
            <CardContent className={cn(`flex flex-col gap-4 p-0`)}>
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
