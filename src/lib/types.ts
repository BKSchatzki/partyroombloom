export type Outline = {
  id: number | null;
  title?: string;
  description?: string;
  goal?: string;
  comments?: string;
  elements: Array<Element>;
};

export type Element = {
  id: string;
  parentId: string | null;
  type: 'landmark' | 'interactable' | 'secret';
  name?: string;
  description?: string;
  rollableSuccess?: string;
  rollableFailure?: string;
  userCreatedAt: string;
};
