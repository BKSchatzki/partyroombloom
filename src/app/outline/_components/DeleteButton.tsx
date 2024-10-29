import React from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DeleteButton = ({
  first,
  handleDelete,
  message,
}: {
  first: boolean;
  handleDelete: any;
  message: string;
}) => {
  return (
    <div
      className={cn(
        `absolute left-[1px] top-[1px] rounded-b-none rounded-br-xl rounded-tr-none bg-error/25`,
        first ? 'rounded-tl-xl' : 'rounded-tl-none'
      )}
    >
      <Button
        className={cn(
          `rounded-bl-none rounded-br-xl rounded-tr-none`,
          first ? 'rounded-tl-xl' : 'rounded-tl-none'
        )}
        color={`error`}
        onClick={handleDelete}
        outlined={true}
        size={`sm`}
      >
        <X className={cn(`size-5`)} />
        <span className={cn(`sr-only`)}>{message}</span>
      </Button>
    </div>
  );
};

export default DeleteButton;
