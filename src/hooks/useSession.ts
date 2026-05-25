'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { parseSessionPayload, type SessionPayload } from '@/lib/session';

const SESSION_QUERY_KEY = ['session'];

const fetchSession = async (): Promise<SessionPayload> => {
  const response = await fetch('/api/session', {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load session.');
  }

  const payload = parseSessionPayload(await response.json());
  if (!payload) {
    throw new Error('Session response did not match the expected shape.');
  }

  return payload;
};

const signOut = async (): Promise<SessionPayload> => {
  const response = await fetch('/api/session', {
    method: 'DELETE',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to sign out.');
  }

  const payload = parseSessionPayload(await response.json());
  if (!payload) {
    throw new Error('Sign-out response did not match the expected shape.');
  }

  return payload;
};

export const useSession = () => {
  return useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSession,
    placeholderData: { user: null },
    retry: false,
    staleTime: 30_000,
  });
};

export const useSignOut = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: (payload) => {
      queryClient.setQueryData(SESSION_QUERY_KEY, payload);
      onSuccess?.();
    },
  });
};
