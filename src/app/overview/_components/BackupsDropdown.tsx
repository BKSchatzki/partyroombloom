'use client';

import React, { useRef } from 'react';

import {
  Braces,
  FileText,
  Upload,
} from 'lucide-react';
import dynamic from 'next/dynamic';

import OutlineJsonSave from '@/components/OutlineJsonSave';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

const OutlinePdfGen = dynamic(() => import('@/components/OutlinePdfGen'), {
  ssr: false,
  loading: () => (
    <div className={cn(`flex h-full w-full items-center gap-2 p-4`)}>
      <FileText className={cn(`size-5 animate-spin`)} />
      Generating PDF
    </div>
  ),
});

interface BackupsDropdownProps {
  outline: Outline;
  setOutline: ((value: Outline | ((prev: Outline) => Outline)) => void) | null;
  className?: string;
  children: React.ReactNode;
}

const BackupsDropdown: React.FC<BackupsDropdownProps> = ({
  outline,
  setOutline,
  className,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Upload started');
    const files = event.target.files;
    if (!files?.length) {
      return;
    }
    if (!setOutline) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e?.target?.result as string);
        setOutline(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    reader.readAsText(files[0]);
    event.target.value = '';
  };

  return (
    <>
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
              `rounded-xl bg-warning/10 p-0 font-semibold hover:bg-warning hover:text-base-300 focus:bg-warning focus:text-base-300`
            )}
          >
            <OutlinePdfGen
              outline={outline}
              className={cn(`flex h-full w-full items-center gap-2 p-4`)}
            >
              <FileText className={cn(`size-5`)} />
              Download as PDF
            </OutlinePdfGen>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              `rounded-xl bg-fuchsia-500/10 p-0 font-semibold hover:bg-fuchsia-500 hover:text-base-300 focus:bg-fuchsia-500 focus:text-base-300`
            )}
          >
            <OutlineJsonSave
              outline={outline}
              className={cn(`flex h-full w-full items-center gap-2 p-4`)}
            >
              <Braces className={cn(`size-5`)} />
              Download as JSON
            </OutlineJsonSave>
          </DropdownMenuItem>
          {setOutline !== null && (
            <DropdownMenuItem
              className={cn(
                `rounded-xl bg-info/10 p-0 font-semibold hover:bg-info hover:text-base-300 focus:bg-info focus:text-base-300`
              )}
            >
              <button
                onClick={() => fileInputRef.current?.click()}
                className={cn(`flex h-full w-full items-center gap-2 p-4`)}
              >
                <Upload className={cn(`size-5`)} />
                Restore from JSON
              </button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {setOutline !== null && (
        <Input
          type={`file`}
          ref={fileInputRef}
          onChange={handleUpload}
          className={cn(`hidden`)}
        />
      )}
    </>
  );
};

export default BackupsDropdown;
