import React from 'react';

import Container from '@/components/Container';
import { validateRequest } from '@/lib/auth';

import Builder from '../outline/_components/Builder';

const Tutorial = async () => {
  const { user } = await validateRequest();

  return (
    <Container>
      <Builder
        tutorialMode={true}
        user={user}
      />
    </Container>
  );
};

export default Tutorial;
