import React from 'react';

import Container from '@/components/Container';
import { toClientUser, validateRequest } from '@/lib/auth';

import Builder from '../_components/Builder';

const Outline = async () => {
  const { user } = await validateRequest();

  return (
    <Container>
      <Builder user={user ? toClientUser(user) : null} />
    </Container>
  );
};

export default Outline;
