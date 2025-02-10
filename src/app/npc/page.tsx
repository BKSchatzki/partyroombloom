'use client';

import React, { useState } from 'react';

import GenericError from '@/components/GenericError';
import { useQuery } from '@tanstack/react-query';

const Npc = () => {
  const [npc, setNpc] = useState(null);

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

  return <div>{npc}</div>;
};

export default Npc;
