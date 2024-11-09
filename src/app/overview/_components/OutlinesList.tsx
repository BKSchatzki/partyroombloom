'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import { useAtom } from 'jotai';

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
  }, []);

  return (
    <div>
      {outlinesList.map((outline) => (
        <div
          key={outline.id}
          className={cn(`flex flex-col gap-2`)}
        >
          <span>{outline.id}</span>
          <span>{outline.title}</span>
          <span>{outline.description}</span>
          <span>{outline.goal}</span>
          <span>{outline.comments}</span>
        </div>
      ))}
    </div>
  );
};

export default OutlinesList;
