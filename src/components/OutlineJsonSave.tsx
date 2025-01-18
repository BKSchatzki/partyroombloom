import React from 'react';

import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

import { Outline } from '@/lib/types';
import { cn } from '@/lib/utils';

interface OutlineJsonSaveProps {
  outline: Outline;
  className?: string;
  children: React.ReactNode;
}

const OutlineJsonSave: React.FC<OutlineJsonSaveProps> = ({ outline, className, children }) => {
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
