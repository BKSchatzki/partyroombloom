'use client';

import React, { Dispatch, SetStateAction, useCallback, useMemo, useRef, useState } from 'react';

import dayjs from 'dayjs';
import saveAs from 'file-saver';
import { Braces, FileText, Upload } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OutlineTreeSchema } from '@/lib/schemas';
import { InteractableNode, LandmarkNode, Outline, SecretNode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ManageDropdownProps {
  outline: Outline;
  setOutline: Dispatch<SetStateAction<Outline>> | null;
  tutorialMode?: boolean;
  className?: string;
  children: React.ReactNode;
}

const ManageDropdownComponent: React.FC<ManageDropdownProps> = ({
  outline,
  setOutline,
  tutorialMode = false,
  className,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const handleDownload = useCallback(async () => {
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
  }, [outline]);

  const fileToSave = useMemo(
    () =>
      new Blob([JSON.stringify(outline)], {
        type: 'application/json',
      }),
    [outline]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleTriggerPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!open) {
        return;
      }

      event.preventDefault();
      setOpen(false);
    },
    [open]
  );

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          const rawData = JSON.parse(e?.target?.result as string);
          const parsedOutline = OutlineTreeSchema.safeParse(rawData);
          if (!parsedOutline.success) {
            console.error('Invalid JSON outline payload:', parsedOutline.error.flatten());
            return;
          }

          const remapSecret = (secret: SecretNode, parentId: string): SecretNode => ({
            ...secret,
            id: crypto.randomUUID(),
            parentId,
            children: [],
          });

          const remapInteractable = (
            interactable: InteractableNode,
            parentId: string
          ): InteractableNode => {
            const interactableId = crypto.randomUUID();
            return {
              ...interactable,
              id: interactableId,
              parentId,
              children: interactable.children.map((secret) => remapSecret(secret, interactableId)),
            };
          };

          const remapLandmark = (landmark: LandmarkNode): LandmarkNode => {
            const landmarkId = crypto.randomUUID();
            return {
              ...landmark,
              id: landmarkId,
              parentId: null,
              children: landmark.children.map((interactable) =>
                remapInteractable(interactable, landmarkId)
              ),
            };
          };

          const normalizedOutline: Outline = {
            ...parsedOutline.data,
            id: null,
            conversations: [],
            elements: parsedOutline.data.elements.map((landmark) => remapLandmark(landmark)),
          };

          setOutline(normalizedOutline);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(files[0]);
      event.target.value = '';
    },
    [setOutline]
  );

  return (
    <>
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button
            type={`button`}
            color={`ghost`}
            size={`block`}
            onPointerDown={handleTriggerPointerDown}
            className={cn(
              `text-base-300 ring-offset-base-300 col-span-12 h-10 min-h-10 max-w-full rounded-3xl border border-orange-800 bg-orange-700 px-4 text-sm font-semibold ring-orange-600 ring-offset-2 transition-all duration-100 ease-in-out outline-none hover:bg-orange-700 hover:brightness-90 focus:ring-2 disabled:bg-orange-700/30 sm:col-span-3`,
              className
            )}
          >
            {children}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn(`bg-base-300 flex flex-col gap-2 rounded-2xl`)}>
          <DropdownMenuItem
            asChild
            className={cn(
              `bg-warning/10 hover:bg-warning hover:text-base-300 focus:bg-warning focus:text-base-300 cursor-pointer rounded-xl p-0 font-semibold`
            )}
          >
            <button
              onClick={handleDownload}
              className={cn(`flex h-full w-full items-center gap-2 p-4`)}
            >
              <FileText
                aria-hidden={true}
                className={cn(`size-5`)}
              />
              Download as PDF
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className={cn(
              `hover:text-base-300 focus:text-base-300 cursor-pointer rounded-xl bg-fuchsia-500/10 p-0 font-semibold hover:bg-fuchsia-500 focus:bg-fuchsia-500`
            )}
          >
            <button
              onClick={() =>
                saveAs(fileToSave, `${outline.title} ${dayjs().format('MM-DD-YYYY HH_MM_ss')}.json`)
              }
              className={cn(`flex h-full w-full items-center gap-2 p-4`)}
            >
              <Braces
                aria-hidden={true}
                className={cn(`size-5`)}
              />
              Download as JSON
            </button>
          </DropdownMenuItem>
          {setOutline !== null && !tutorialMode && (
            <DropdownMenuItem
              asChild
              className={cn(
                `bg-info/10 hover:bg-info hover:text-base-300 focus:bg-info focus:text-base-300 cursor-pointer rounded-xl p-0 font-semibold`
              )}
            >
              <button
                onClick={() => fileInputRef.current?.click()}
                className={cn(`flex h-full w-full items-center gap-2 p-4`)}
              >
                <Upload
                  aria-hidden={true}
                  className={cn(`size-5`)}
                />
                Restore from JSON
              </button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {setOutline !== null && !tutorialMode && (
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
const ManageDropdown = React.memo(ManageDropdownComponent);
ManageDropdown.displayName = 'ManageDropdown';
export default ManageDropdown;
