import { redirect } from 'next/navigation';

import Container from '@/components/Container';
import { toClientUser, validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import Builder from '../_components/Builder';

const ViewOutline = async ({ params }: { params: Promise<{ outlineId: string }> }) => {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/');
  }

  const { outlineId: outlineIdParam } = await params;
  const outlineId = parseInt(outlineIdParam, 10);
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
        user={toClientUser(user)}
      />
    </Container>
  );
};

export default ViewOutline;
