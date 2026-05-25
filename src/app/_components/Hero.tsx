import type { User } from '@/lib/auth';
import { ArrowRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';

import { SignIn } from '@/components/SignIn';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroProps {
  user: User | null;
}

const Hero: React.FC<HeroProps> = ({ user }) => {
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
      <div className={cn(`flex gap-8 max-sm:flex-col`)}>
        <Link
          href={`/outline/tutorial`}
          role={`none`}
          tabIndex={-1}
        >
          <Button
            color={`primary`}
            role={`link`}
            size={`wide`}
          >
            How it works
            <GraduationCap
              aria-hidden={true}
              className={cn(`size-5`)}
            />
          </Button>
        </Link>
        {user ? (
          <Link
            href={`/overview`}
            role={`none`}
            tabIndex={-1}
          >
            <Button
              color={`neutral`}
              role={`link`}
              size={`wide`}
            >
              Go to overview
              <ArrowRight
                aria-hidden={true}
                className={cn(`size-5`)}
              />
            </Button>
          </Link>
        ) : (
          <SignIn className={cn(`btn-wide`)} />
        )}
      </div>
    </div>
  );
};

export default Hero;
