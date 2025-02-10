'use client';

import React, { useState } from 'react';

import Container from '@/components/Container';
import GenericError from '@/components/GenericError';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

type Npc = {
  name: string;
  species: string;
  gender: string;
  age: string;
  anatomy: { build: string; height: string };
  skin: { color: string; texture: string };
  hair: { color: string; style: string };
  eyes: { color: string; shape: string };
  voice: { pitch: string; quality: string; speed: string; volume: string };
  features: string;
  mannerisms: string;
  motivation: string;
  plotHooks: string;
};

const Npc = () => {
  const [npc, setNpc] = useState<Npc | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['npcApi'],
    queryFn: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_NPC_SERVICE_URL}/npc`);
        if (!response.ok) {
          throw new Error(`Error fetching NPC: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setNpc(data);
        return npc;
      } catch (error) {
        console.error('Failed to fetch NPC:', error);
      }
    },
  });

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
    <Container>
      <ScrollArea className={cn(`flex h-full w-full flex-col gap-4 sm:px-4`)}>
        <div className={cn(`mx-auto flex flex-col gap-6 px-4 py-8 max-sm:px-0`)}>
          This is {npc?.name}, a {npc?.gender}, {npc?.anatomy.height}, {npc?.anatomy.build},{' '}
          {npc?.age} {npc?.species}. They have {npc?.skin.color}, {npc?.skin.texture} skin,{' '}
          {npc?.hair.color} hair in a {npc?.hair.style}. They have {npc?.eyes.shape},{' '}
          {npc?.eyes.color} eyes. They have a {npc?.voice.pitch}, {npc?.voice.quality} voice, and
          speak with {npc?.voice.speed} speed and {npc?.voice.volume} volume. They have{' '}
          {npc?.features}, and {npc?.mannerisms}. They are motivated by {npc?.motivation}, and they{' '}
          {npc?.plotHooks}.
        </div>
      </ScrollArea>
    </Container>
  );
};

export default Npc;
