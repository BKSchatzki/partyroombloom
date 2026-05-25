import React from 'react';

import { redirect } from 'next/navigation';

import Container from '@/components/Container';
import { toClientUser, validateRequest } from '@/lib/auth';

import OutlinesList from './_components/OutlinesList';

const Overview = async () => {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/');
  }

  return (
    <Container>
      <OutlinesList user={toClientUser(user)} />
    </Container>
  );
};

export default Overview;
