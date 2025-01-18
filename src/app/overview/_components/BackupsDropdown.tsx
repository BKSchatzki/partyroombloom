import React from 'react';

import {
  Braces,
  ChevronDown,
  FileText,
} from 'lucide-react';

import OutlineJsonSave from '@/components/OutlineJsonSave';
import OutlinePdfGen from '@/components/OutlinePdfGen';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

const BackupsDropdown = ({
  outline,
  className,
  children,
}: {
  outline: Outline;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          `col-span-12 flex min-h-12 max-w-full items-center justify-center gap-2 rounded-3xl border border-orange-800 bg-orange-700 font-semibold text-base-300 outline-none ring-orange-600 ring-offset-2 ring-offset-base-300 transition-all duration-100 ease-in-out hover:bg-orange-700 hover:brightness-90 focus:ring-2 disabled:bg-orange-700/30 sm:col-span-2`,
          className
        )}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn(`flex flex-col gap-2 rounded-2xl bg-base-300`)}>
        <DropdownMenuItem
          className={cn(
            `rounded-xl bg-warning/10 px-4 py-2 font-semibold hover:bg-warning hover:text-base-300 focus:bg-warning focus:text-base-300`
          )}
        >
          <OutlinePdfGen
            outline={outline}
            className={cn(`flex h-full w-full items-center gap-2`)}
          >
            <FileText className={cn(`size-5`)} />
            Download as PDF
          </OutlinePdfGen>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            `rounded-xl bg-info/10 px-4 py-2 font-semibold hover:bg-info hover:text-base-300 focus:bg-info focus:text-base-300`
          )}
        >
          <OutlineJsonSave
            outline={outline}
            className={cn(`flex h-full w-full items-center gap-2`)}
          >
            <Braces className={cn(`size-5`)} />
            Download as JSON
          </OutlineJsonSave>
        </DropdownMenuItem>
        <DropdownMenuSeparator className={cn(`-my-0.5`)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BackupsDropdown;

{
  /* PDF BUTTON */
}
{
  /* JSON BUTTON */
}
