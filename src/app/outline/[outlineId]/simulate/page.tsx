import React from 'react';

import { redirect } from 'next/navigation';

import Container from '@/components/Container';
import { validateRequest } from '@/lib/auth';

import Chat from './_components/Chat';

const Simulate = async ({ params }: { params: { outlineId: string } }) => {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/');
  }

  return (
    <Container>
      <Chat
        outlineId={params.outlineId}
        simulateId={null}
        user={user}
      />
    </Container>
  );
};

export default Simulate;
