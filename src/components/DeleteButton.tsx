'use client';

import React from 'react';

import {
  Trash2,
  X,
} from 'lucide-react';

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

interface DeleteButtonProps {
  block: boolean;
  first: boolean;
  handleDelete: any;
  item: string;
  message: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  block = false,
  first = true,
  handleDelete,
  item,
  message,
}) => {
  if (block) {
    return (
      <Dialog>
        <div className={cn(`rounded-3xl bg-error/25`)}>
          <DialogTrigger className={cn(`btn btn-outline btn-error btn-block`)}>
            <Trash2 className={cn(`size-5`)} />
            {message}
          </DialogTrigger>
        </div>
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
    );
  }

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
