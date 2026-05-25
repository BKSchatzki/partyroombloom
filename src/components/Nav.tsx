'use client';

import React from 'react';

import { Grid2X2, Leaf, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { SignIn, SignOut } from '@/components/AuthButtons';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

const NavComponent: React.FC = () => {
  const { data } = useSession();
  const user = data?.user ?? null;

  return (
    <nav
      className={cn(
        'navbar bg-base-300 flex items-center justify-between border-b-2 border-[#302a2a] px-4'
      )}
    >
      <Link
        href={`/`}
        role={`none`}
        tabIndex={-1}
      >
        <Button role={`link`}>
          <Image
            src={`/assets/prb-logo.png`}
            alt={`PartyRoomBloom Logo`}
            width={32}
            height={32}
            className={cn(`size-8`)}
          />
          <h2
            className={cn(
              `flex items-center gap-2 text-2xl font-bold tracking-tighter max-lg:hidden`
            )}
          >
            PartyRoomBloom
          </h2>
        </Button>
      </Link>
      {!user ? (
        <SignIn />
      ) : (
        <>
          <ul className={cn(`flex gap-4 max-md:hidden`)}>
            <li>
              <Link
                href={`/overview`}
                role={`none`}
                tabIndex={-1}
              >
                <Button
                  color={'info'}
                  outlined={true}
                  role={`link`}
                  className={cn(`flex items-center gap-2 border-0 text-lg`)}
                >
                  <Grid2X2
                    aria-hidden={true}
                    className={cn(`size-5`)}
                  />
                  Overview
                </Button>
              </Link>
            </li>
            <li>
              <Link
                href={`/outline/new`}
                role={`none`}
                tabIndex={-1}
              >
                <Button
                  color={`secondary`}
                  outlined={true}
                  role={`link`}
                  className={cn(`flex items-center gap-2 border-0 text-lg`)}
                >
                  <Leaf
                    aria-hidden={true}
                    className={cn(`size-5`)}
                  />
                  New Outline
                </Button>
              </Link>
            </li>
            <li>
              <SignOut />
            </li>
          </ul>
          <Drawer>
            <DrawerTrigger className={cn(`btn btn-outline btn-warning btn-sm px-1 py-0 md:hidden`)}>
              <Menu className={cn(`size-6`)} />
            </DrawerTrigger>
            <DrawerContent className={cn(`bg-base-100`)}>
              <DrawerHeader className={cn(`sr-only`)}>
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerDescription>Navigate to different sections</DrawerDescription>
              </DrawerHeader>
              <ul className={cn(`flex flex-col items-center py-4`)}>
                <li>
                  <Link
                    href={`/overview`}
                    role={`none`}
                    tabIndex={-1}
                  >
                    <DrawerClose
                      role={`link`}
                      className={cn(
                        `btn btn-outline btn-info btn-wide flex items-center gap-2 border-0 text-lg`
                      )}
                    >
                      <Grid2X2
                        aria-hidden={true}
                        className={cn(`size-5`)}
                      />
                      Overview
                    </DrawerClose>
                  </Link>
                </li>
                <Separator className={cn(`border-base-300 mx-auto my-2 w-5/6`)} />
                <li>
                  <Link
                    href={`/outline/new`}
                    role={`none`}
                    tabIndex={-1}
                  >
                    <DrawerClose
                      role={`link`}
                      className={cn(
                        `btn btn-outline btn-secondary btn-wide flex items-center gap-2 border-0 text-lg`
                      )}
                    >
                      <Leaf
                        aria-hidden={true}
                        className={cn(`size-5`)}
                      />
                      New Outline
                    </DrawerClose>
                  </Link>
                </li>
                <Separator className={cn(`border-base-300 mx-auto my-2 w-5/6`)} />
                <li>
                  <SignOut className={'btn-wide'} />
                </li>
              </ul>
              <DrawerFooter></DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </nav>
  );
};
const Nav = React.memo(NavComponent);
Nav.displayName = 'Nav';
export default Nav;
