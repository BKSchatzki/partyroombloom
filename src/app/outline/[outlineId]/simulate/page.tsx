import React from 'react';

import Container from '@/components/Container';

import Chat from './_components/Chat';

const Simulate = ({ params }: { params: { outlineId: string } }) => {
  return (
    <Container>
      <Chat
        outlineId={params.outlineId}
        simulateId={null}
      />
    </Container>
  );
};

export default Simulate;
