import React from 'react';

import Container from '@/components/Container';

import Builder from '../outline/_components/Builder';

const Tutorial = () => {
  return (
    <Container>
      <Builder
        outlineId={null}
        tutorialMode={true}
      />
    </Container>
  );
};

export default Tutorial;
