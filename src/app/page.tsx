import { redirect } from 'next/navigation';

import { validateRequest } from '@/lib/auth';

export default async function Home() {
  const { user } = await validateRequest();
  if (user) {
    redirect('/overview');
  }

  return <div className="flex h-full w-full items-center justify-center">Home</div>;
}
