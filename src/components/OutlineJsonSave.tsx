import React from 'react';

import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

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
    <button
      onClick={() =>
        saveAs(fileToSave, `${outline.title} ${dayjs().format('MM-DD-YYYY HH_MM_ss')}.json`)
      }
      className={cn(``, className)}
    >
      {children}
    </button>
  );
};

export default OutlineJsonSave;
