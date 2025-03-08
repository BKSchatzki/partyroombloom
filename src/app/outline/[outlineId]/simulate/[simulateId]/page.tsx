import { redirect } from 'next/navigation';

import Container from '@/components/Container';
import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import Chat from '../_components/Chat';

const ViewSimulation = async ({ params }: { params: { simulateId: string } }) => {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/');
  }

  const simulateId = parseInt(params.simulateId);
  if (isNaN(simulateId)) {
    redirect('/outline');
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: simulateId,
      userId: user.id,
    },
  });

  if (!conversation) {
    redirect('/overview');
  }

  return (
    <Container>
      <Chat
        simulateId={conversation.id}
        outlineId={null}
        user={user}
      />
    </Container>
  );
};

export default ViewSimulation;
