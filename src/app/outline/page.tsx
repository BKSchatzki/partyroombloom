import React from 'react';

import Container from '@/components/Container';
import { validateRequest } from '@/lib/auth';

import Builder from './_components/Builder';

const Outline = async () => {
  const { user } = await validateRequest();

  return (
    <Container>
      <Builder user={user} />
    </Container>
  );
};

export default Outline;
