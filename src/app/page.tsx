import type { User } from 'lucia';
import {
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';

import Container from '@/components/Container';
import { SignIn } from '@/components/SignIn';
import { ScrollArea } from '@/components/ui/scroll-area';
import { validateRequest } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <Container
      className={cn(`max-w-[72rem] gap-16 bg-gradient-to-b from-transparent from-80% to-base-100`)}
    >
      <ScrollArea className={cn(`flex h-full w-full flex-col gap-4`)}>
        <Hero user={user} />
      </ScrollArea>
    </Container>
  );
}

const Hero = ({ user }: { user: User | null }) => {
  return (
    <div
      className={cn(
        `flex w-full flex-col items-center text-balance bg-gradient-to-b from-base-300 to-transparent px-4 pb-16 pt-16 text-center`
      )}
    >
      <div className={cn(`max-w-xl`)}>
        <h1 className={cn(`text-5xl font-black`)}>
          The game master's inspirational{' '}
          <span
            className={cn(`bg-gradient-to-br from-error to-warning bg-clip-text text-transparent`)}
          >
            session planning toolkit
          </span>
        </h1>
        <p className={cn(`py-6 text-base-content/75`)}>
          PartyRoomBloom scaffolds your exploration scenes to help you plan engaging game nights
          better than ever.
        </p>
      </div>
      <div className={cn(`flex gap-4 max-sm:flex-col`)}>
        <Link
          href={`/outline/tutorial`}
          tabIndex={0}
          className={cn(`btn btn-primary`)}
        >
          How it works
          <GraduationCap className={cn(`size-5`)} />
        </Link>
        {user ? (
          <Link
            href={`/overview`}
            tabIndex={0}
            className={cn(`btn btn-neutral`)}
          >
            Go to overview
            <ArrowRight className={cn(`size-5`)} />
          </Link>
        ) : (
          <SignIn />
        )}
      </div>
    </div>
  );
};
