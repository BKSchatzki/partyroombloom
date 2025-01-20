'use client';

import React, { useRef } from 'react';

import dayjs from 'dayjs';
import saveAs from 'file-saver';
import {
  Braces,
  FileText,
  Upload,
} from 'lucide-react';
import { v7 } from 'uuid';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Element,
  Outline,
} from '@/lib/types';
import { cn } from '@/lib/utils';

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
  const handleDownload = async () => {
    try {
      if (typeof window !== 'undefined') {
        const { pdf } = await import('@react-pdf/renderer');
        const OutlinePdfOutput = (await import('@/components/OutlinePdfOutput')).default;
        const blob = await pdf(<OutlinePdfOutput outline={outline} />).toBlob();
        saveAs(blob, `${outline.title} ${dayjs().format('MM-DD-YYYY HH_MM_ss')}.pdf`);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  const fileToSave = new Blob([JSON.stringify(outline)], {
    type: 'application/json',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

        // linear time this
        /* let newId: string;
          data.elements.forEach((element: Element) => {
          newId = v7();
          data.elements.forEach((child: Element) => {
            if (child.parentId === element.id) {
              child.parentId = newId;
            }
          });
          element.id = newId;
        });
        data.id = null;
        data.conversations = [];
        data.elements.sort((a: Element, b: Element) =>
          a.userCreatedAt.toString().localeCompare(b.userCreatedAt.toString())
        ); */
        // this is lame

        // yay i did it
        const idMap = new Map<string, string>();
        data.elements.forEach((element: Element) => {
          idMap.set(element.id, v7());
        });
        data.elements = data.elements.map((element: Element) => ({
          ...element,
          id: idMap.get(element.id),
          parentId: element.parentId ? (idMap.get(element.parentId) ?? null) : null,
        }));
        data.id = null;
        data.conversations = [];
        data.elements.sort((a: Element, b: Element) =>
          a.userCreatedAt.toString().localeCompare(b.userCreatedAt.toString())
        );
        // hooray for maps

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
            asChild
            className={cn(
              `cursor-pointer rounded-xl bg-warning/10 p-0 font-semibold hover:bg-warning hover:text-base-300 focus:bg-warning focus:text-base-300`
            )}
          >
            <button
              onClick={handleDownload}
              className={cn(`flex h-full w-full items-center gap-2 p-4`)}
            >
              <FileText className={cn(`size-5`)} />
              Download as PDF
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className={cn(
              `cursor-pointer rounded-xl bg-fuchsia-500/10 p-0 font-semibold hover:bg-fuchsia-500 hover:text-base-300 focus:bg-fuchsia-500 focus:text-base-300`
            )}
          >
            <button
              onClick={() =>
                saveAs(fileToSave, `${outline.title} ${dayjs().format('MM-DD-YYYY HH_MM_ss')}.json`)
              }
              className={cn(`flex h-full w-full items-center gap-2 p-4`)}
            >
              <Braces className={cn(`size-5`)} />
              Download as JSON
            </button>
          </DropdownMenuItem>
          {setOutline !== null && (
            <DropdownMenuItem
              asChild
              className={cn(
                `cursor-pointer rounded-xl bg-info/10 p-0 font-semibold hover:bg-info hover:text-base-300 focus:bg-info focus:text-base-300`
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
