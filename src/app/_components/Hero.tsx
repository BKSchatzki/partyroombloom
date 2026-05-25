'use client';

import { ArrowRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';

import { SignIn } from '@/components/AuthButtons';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

const Hero: React.FC = () => {
  const { data } = useSession();
  const user = data?.user ?? null;

  return (
    <div
      className={cn(
        `from-base-300/75 flex w-full flex-col items-center bg-linear-to-b to-transparent px-4 pt-16 text-center text-balance`
      )}
    >
      <div className={cn(`max-w-xl`)}>
        <h1 className={cn(`text-5xl font-black`)}>
          The game master's inspirational{' '}
          <span
            className={cn(`from-error to-warning bg-linear-to-br bg-clip-text text-transparent`)}
          >
            session planning toolkit
          </span>
        </h1>
        <p className={cn(`text-base-content/75 py-6`)}>
          PartyRoomBloom scaffolds your exploration scenes to help you plan engaging game nights
          better than ever.
        </p>
      </div>
      <div className={cn(`grid w-full max-w-xl grid-cols-2 gap-4 max-sm:grid-cols-1`)}>
        <Button
          asChild
          color={`primary`}
          className={cn(`h-12 min-h-12 w-full gap-2 whitespace-nowrap`)}
        >
          <Link href={`/outline/tutorial`}>
            How it works
            <GraduationCap
              aria-hidden={true}
              className={cn(`size-5`)}
            />
          </Link>
        </Button>
        {user ? (
          <Button
            asChild
            color={`neutral`}
            className={cn(`h-12 min-h-12 w-full gap-2 whitespace-nowrap`)}
          >
            <Link href={`/overview`}>
              Go to overview
              <ArrowRight
                aria-hidden={true}
                className={cn(`size-5`)}
              />
            </Link>
          </Button>
        ) : (
          <SignIn className={cn(`!h-12 !min-h-12 !w-full !max-w-none`)} />
        )}
      </div>
    </div>
  );
};

export default Hero;
