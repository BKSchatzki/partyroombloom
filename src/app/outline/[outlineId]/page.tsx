import { redirect } from 'next/navigation';

import Container from '@/components/Container';
import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import Builder from '../_components/Builder';

const ViewOutline = async ({ params }: { params: { outlineId: string } }) => {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/');
  }

  const outlineId = parseInt(params.outlineId);
  if (isNaN(outlineId)) {
    redirect('/outline');
  }

  const outline = await prisma.outline.findUnique({
    where: {
      id: outlineId,
      userId: user.id,
    },
  });

  if (!outline) {
    redirect('/outline');
  }

  return (
    <Container>
      <Builder
        outlineId={outline.id}
        user={user}
      />
    </Container>
  );
};

export default ViewOutline;
