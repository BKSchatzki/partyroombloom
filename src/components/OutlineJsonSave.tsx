import React from 'react';

import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';

const OutlineJsonSave = ({
  outline,
  className,
  children,
}: {
  outline: Outline;
  className?: string;
  children: React.ReactNode;
}) => {
  const fileToSave = new Blob([JSON.stringify(outline)], {
    type: 'application/json',
  });

  return (
    <Button
      onClick={() =>
        saveAs(fileToSave, `${outline.title} - ${dayjs().format('ddd MMM D, YYYY - h:mm A')}.json`)
      }
      className={cn(``, className)}
    >
      {children}
    </Button>
  );
};

export default OutlineJsonSave;
