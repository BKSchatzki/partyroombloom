'use client';

import React from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const DeleteButton = ({
  first,
  handleDelete,
  item,
  message,
}: {
  first: boolean;
  handleDelete: any;
  item: string;
  message: string;
}) => {
  return (
    <div
      className={cn(
        `absolute right-[1px] top-[1px] rounded-b-none rounded-bl-xl rounded-tl-none bg-error/25`,
        first ? 'sm:rounded-tr-xl' : 'rounded-tr-none'
      )}
    >
      <Dialog>
        <DialogTrigger>
          <div
            className={cn(
              `btn btn-outline btn-error btn-sm rounded-bl-xl rounded-br-none rounded-tl-none`,
              first ? 'rounded-tr-xl max-sm:rounded-tr-none' : 'rounded-tr-none'
            )}
          >
            <X className={cn(`size-5`)} />
            <span className={cn(`sr-only`)}>{message}</span>
          </div>
        </DialogTrigger>
        <DialogContent className={cn(`bg-base-200 border-none text-base-content`)}>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription className={cn(`text-base-content/75`)}>
              If you delete {item}, there is no going back. Think twice before you decide to get rid
              of it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={cn(`gap-2`)}>
            <Button
              color={`error`}
              onClick={handleDelete}
              className={cn(`bg-error/25 text-error hover:text-black`)}
            >
              Confirm Delete
            </Button>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteButton;
