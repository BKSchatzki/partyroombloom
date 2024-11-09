import React from 'react';

import { redirect } from 'next/navigation';

import Container from '@/components/Container';
import { validateRequest } from '@/lib/auth';
import { cn } from '@/lib/utils';

import OutlinesList from './_components/OutlinesList';

const Overview = async () => {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/');
  }

  return (
    <Container>
      <OutlinesList />
    </Container>
  );
};

export default Overview;
