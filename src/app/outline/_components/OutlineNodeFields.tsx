'use client';

import React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OutlineNodeField } from '@/lib/outlineState';
import { cn } from '@/lib/utils';

import { OutlineNodeFieldsConfig } from './outlineNodeConfig';

interface OutlineNodeFieldsProps {
  nodeId: string;
  nameValue: string;
  descriptionValue: string;
  fieldsConfig: OutlineNodeFieldsConfig;
  onChange: (
    nodeId: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: Extract<OutlineNodeField, 'name' | 'description'>
  ) => void;
}

const OutlineNodeFieldsComponent: React.FC<OutlineNodeFieldsProps> = ({
  nodeId,
  nameValue,
  descriptionValue,
  fieldsConfig,
  onChange,
}) => {
  return (
    <>
      <Label
        className={cn(`sr-only`)}
        htmlFor={`name-${nodeId}`}
      >
        {fieldsConfig.nameLabel}
      </Label>
      <Input
        className={cn(`w-full`)}
        id={`name-${nodeId}`}
        onChange={(event) => onChange(nodeId, event, 'name')}
        placeholder={fieldsConfig.namePlaceholder}
        value={nameValue}
      />
      <Label
        className={cn(`sr-only`)}
        htmlFor={`description-${nodeId}`}
      >
        {fieldsConfig.descriptionLabel}
      </Label>
      <Textarea
        className={cn(`no-scrollbar`)}
        id={`description-${nodeId}`}
        onChange={(event) => onChange(nodeId, event, 'description')}
        placeholder={fieldsConfig.descriptionPlaceholder}
        value={descriptionValue}
      />
    </>
  );
};

const OutlineNodeFields = React.memo(OutlineNodeFieldsComponent);
OutlineNodeFields.displayName = 'OutlineNodeFields';

export default OutlineNodeFields;
