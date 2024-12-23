import React from 'react';

import { User } from 'lucia';
import { Flower, Grid2X2, Leaf, Menu, Sparkle } from 'lucide-react';
import Link from 'next/link';

import { SignIn, SignOut } from '@/components/SignIn';
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
import { cn } from '@/lib/utils';

const Nav = ({ user }: { user: User | null }) => {
  return (
    <nav className={cn('navbar flex items-center justify-between bg-base-300 px-4')}>
      <Link href={`/`}>
        <Flower className={cn(`size-8`)} />
        <h2
          className={cn(
            `flex items-center gap-2 text-2xl font-bold tracking-tighter max-lg:hidden`
          )}
        >
          PartyRoomBloom
        </h2>
      </Link>
      {!user ? (
        <SignIn />
      ) : (
        <>
          <ul className={cn(`flex gap-4 max-md:hidden`)}>
            <li>
              <Link href={`/overview`}>
                <Button
                  color={'info'}
                  outlined={true}
                  className={cn(`flex items-center gap-2 border-0 text-lg`)}
                >
                  <Grid2X2 className={cn(`size-5`)} />
                  Overview
                </Button>
              </Link>
            </li>
            {/* <li>
              <Link href={`/outline`}>
                <Button
                  color={`secondary`}
                  outlined={true}
                  className={cn(`flex items-center gap-2 border-0 text-lg`)}
                >
                  <Leaf className={cn(`size-5`)} />
                  Outline
                </Button>
              </Link>
            </li>
            <li>
              <Link href={`/simulate`}>
                <Button
                  color={`primary`}
                  outlined={true}
                  className={cn(`flex items-center gap-2 border-0 text-lg`)}
                >
                  <Sparkle className={cn(`size-5`)} />
                  Simulate
                </Button>
              </Link>
            </li> */}
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
                  <Link href={`/overview`}>
                    <DrawerClose
                      className={cn(
                        `btn btn-outline btn-info btn-wide flex items-center gap-2 border-0 text-lg`
                      )}
                    >
                      <Grid2X2 className={cn(`size-5`)} />
                      Overview
                    </DrawerClose>
                  </Link>
                </li>
                <Separator className={cn(`mx-auto my-2 w-5/6 border-base-300`)} />
                {/* <li>
                  <Link href={`/outline`}>
                    <DrawerClose
                      className={cn(
                        `btn btn-outline btn-secondary btn-wide flex items-center gap-2 border-0 text-lg`
                      )}
                    >
                      <Leaf className={cn(`size-5`)} />
                      Outline
                    </DrawerClose>
                  </Link>
                </li>
                <Separator className={cn(`mx-auto my-2 w-5/6 border-base-300`)} />
                <li>
                  <Link href={`/simulate`}>
                    <DrawerClose
                      className={cn(
                        `btn btn-outline btn-primary btn-wide flex items-center gap-2 border-0 text-lg`
                      )}
                    >
                      <Sparkle className={cn(`size-5`)} />
                      Simulate
                    </DrawerClose>
                  </Link>
                </li>
                <Separator className={cn(`mx-auto my-2 w-5/6 border-base-300`)} /> */}
                <li>
                  <SignOut classProps={'btn-wide'} />
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

export default Nav;
