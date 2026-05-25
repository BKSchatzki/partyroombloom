import React from 'react';

import Container from '@/components/Container';

import Builder from '../_components/Builder';

const Tutorial = () => {
  return (
    <Container>
      <Builder tutorialMode={true} />
    </Container>
  );
};

export default Tutorial;
