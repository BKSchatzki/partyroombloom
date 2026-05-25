'use client';

import React from 'react';

import Container from '@/components/Container';
import GenericError from '@/components/GenericError';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const NpcSchema = z.object({
  name: z.string(),
  species: z.string(),
  gender: z.string(),
  age: z.string(),
  anatomy: z.object({ build: z.string(), height: z.string() }),
  skin: z.object({ color: z.string(), texture: z.string() }),
  hair: z.object({ color: z.string(), style: z.string() }),
  eyes: z.object({ color: z.string(), shape: z.string() }),
  voice: z.object({
    pitch: z.string(),
    quality: z.string(),
    speed: z.string(),
    volume: z.string(),
  }),
  features: z.string(),
  mannerisms: z.string(),
  motivation: z.string(),
  plotHooks: z.string(),
});

type Npc = z.infer<typeof NpcSchema>;

const Npc = () => {
  const {
    data: npc,
    isLoading,
    error,
  } = useQuery<Npc>({
    queryKey: ['npcApi'],
    queryFn: async () => {
      const serviceUrl = process.env.NEXT_PUBLIC_NPC_SERVICE_URL;
      if (!serviceUrl) {
        throw new Error('NPC service URL is not configured.');
      }

      const response = await fetch(`${serviceUrl}/npc`);
      if (!response.ok) {
        throw new Error(`Error fetching NPC: ${response.status}`);
      }

      const parsedNpc = NpcSchema.safeParse(await response.json());
      if (!parsedNpc.success) {
        throw new Error('Invalid NPC payload');
      }

      return parsedNpc.data;
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

  if (isLoading) {
    return (
      <Container>
        <ScrollArea className={cn(`flex h-full w-full flex-col gap-4 sm:px-4`)}>
          <div className={cn(`mx-auto flex flex-col gap-6 px-4 py-8 max-sm:px-0`)}>
            Loading NPC...
          </div>
        </ScrollArea>
      </Container>
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
