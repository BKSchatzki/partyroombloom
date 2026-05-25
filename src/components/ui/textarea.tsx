'use client';

import * as React from 'react';

import TextareaAutosize from 'react-textarea-autosize';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextareaAutosize
        minRows={3}
        className={cn('textarea w-full resize-none px-4 py-3 text-base leading-relaxed', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
