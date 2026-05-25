import { OUTLINE_NODE_TYPES, type Element, type FlatOutlineElement } from './types';

type PersistedElement = {
  id: string;
  parentId: string | null;
  type: string;
  name: string | null;
  description: string | null;
  rollableSuccess: string | null;
  rollableFailure: string | null;
  userCreatedAt: Date;
};

const outlineNodeTypeSet = new Set<string>(OUTLINE_NODE_TYPES);

const isOutlineNodeType = (type: string): type is Element['type'] => {
  return outlineNodeTypeSet.has(type);
};

const parseUserCreatedAt = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const toFlatOutlineElement = (element: PersistedElement): Element => {
  if (!isOutlineNodeType(element.type)) {
    throw new Error(`Unsupported outline element type: ${element.type}`);
  }

  return {
    id: element.id,
    parentId: element.parentId,
    type: element.type,
    name: element.name ?? '',
    description: element.description ?? '',
    rollableSuccess: element.rollableSuccess ?? '',
    rollableFailure: element.rollableFailure ?? '',
    userCreatedAt: element.userCreatedAt.toISOString(),
  };
};

export const toElementWriteData = (element: FlatOutlineElement) => ({
  parentId: element.parentId,
  type: element.type,
  name: element.name ?? '',
  description: element.description ?? '',
  rollableSuccess: element.rollableSuccess ?? '',
  rollableFailure: element.rollableFailure ?? '',
  userCreatedAt: parseUserCreatedAt(element.userCreatedAt),
});
