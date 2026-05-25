'use client';

import React from 'react';

import { Trash2, X } from 'lucide-react';

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
  block?: boolean;
  first?: boolean;
  handleDelete: () => void | Promise<void>;
  item: string;
  message: string;
}

const DeleteButtonComponent: React.FC<DeleteButtonProps> = ({
  block = false,
  first = true,
  handleDelete,
  item,
  message,
}) => {
  return block ? (
    <Dialog>
      <div className={cn(`bg-error/25 rounded-3xl`)}>
        <DialogTrigger
          className={cn(
            `btn btn-outline btn-error btn-block hover:border-error active:border-error h-10 min-h-10 px-4 text-sm`
          )}
        >
          <Trash2 className={cn(`size-5`)} />
          {message}
        </DialogTrigger>
      </div>
      <DialogContent className={cn(`bg-base-200 text-base-content border-none`)}>
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
  ) : (
    <div
      className={cn(
        `bg-error/25 absolute top-[1px] right-[1px] rounded-tl-none rounded-b-none rounded-bl-xl`,
        first ? 'sm:rounded-tr-xl' : 'rounded-tr-none'
      )}
    >
      <Dialog>
        <DialogTrigger
          className={cn(
            `ring-error ring-offset-base-300 rounded-bl-xl ring-offset-2 outline-none ring-inset focus:ring-1`,
            first ? `rounded-tr-xl max-sm:rounded-tr-none` : `rounded-tr-none`
          )}
        >
          <div
            className={cn(
              `btn btn-outline btn-error btn-sm rounded-tl-none rounded-br-none rounded-bl-xl`,
              first ? `rounded-tr-xl max-sm:rounded-tr-none` : `rounded-tr-none`
            )}
          >
            <X className={cn(`size-5`)} />
            <span className={cn(`sr-only`)}>{message}</span>
          </div>
        </DialogTrigger>
        <DialogContent className={cn(`bg-base-200 text-base-content border-none`)}>
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
const DeleteButton = React.memo(DeleteButtonComponent);
DeleteButton.displayName = 'DeleteButton';
export default DeleteButton;
