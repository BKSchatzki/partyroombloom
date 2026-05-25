import React from 'react';

import Container from '@/components/Container';
import { toClientUser, validateRequest } from '@/lib/auth';

import Builder from '../_components/Builder';

const Tutorial = async () => {
  const { user } = await validateRequest();

  return (
    <Container>
      <Builder
        tutorialMode={true}
        user={user ? toClientUser(user) : null}
      />
    </Container>
  );
};

export default Tutorial;
