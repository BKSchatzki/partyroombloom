import Link from 'next/link';
import { redirect } from 'next/navigation';

import Container from '@/components/Container';
import { validateRequest } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default async function Home() {
  const { user } = await validateRequest();
  // if (user) {
  //   redirect('/overview');
  // }

  return (
    <Container className={cn(`max-w-[72rem] gap-16`)}>
      <div
        className={cn(
          `flex w-full flex-col items-center text-balance bg-gradient-to-b from-base-300 to-transparent py-16 text-center`
        )}
      >
        <div className={cn(`max-w-xl`)}>
          <h1 className={cn(`text-5xl font-black`)}>
            The game master's inspirational{' '}
            <span
              className={cn(
                `bg-gradient-to-br from-error to-warning bg-clip-text text-transparent`
              )}
            >
              session planning toolkit
            </span>
          </h1>
          <p className={cn(`py-6 text-base-content/75`)}>
            PartyRoomBloom scaffolds your exploration scenes to help you plan engaging game nights
            better than ever.
          </p>
        </div>
        <div className={cn(`flex gap-4`)}>
          <button className={cn(`btn btn-primary`)}>How it works</button>
          <Link
            href={`/login/google`}
            className={cn(`btn btn-outline`)}
          >
            Get started
          </Link>
        </div>
      </div>
    </Container>
  );
}
