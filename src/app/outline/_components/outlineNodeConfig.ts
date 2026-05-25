import { Lock, MousePointerClick, Plus, Pyramid } from 'lucide-react';

import { OutlineNodeField } from '@/lib/outlineState';

export type OutlineSectionConfig = {
  tutorialPage: 'landmarks' | 'interactables' | 'secrets';
  title: string;
  description: string;
  textClassName: string;
  headingClassName: string;
  titleClassName: string;
  descriptionClassName: string;
  icon: typeof Pyramid;
  iconClassName: string;
  emptyState?: {
    title: string;
    description: string;
    cardClassName: string;
    descriptionClassName: string;
  };
  addButton?: {
    label: string;
    cardClassName: string;
    buttonColor: 'ghost';
    buttonSize: 'block';
    icon: typeof Plus;
    iconClassName: string;
  };
};

export type OutlineNodeFieldsConfig = {
  nameLabel: string;
  descriptionLabel: string;
  namePlaceholder: string;
  descriptionPlaceholder: string;
};

export type OutlineNodeItemConfig = {
  deleteMessage: string;
  deleteItemFallback: string;
  srOnlyTypeLabel?: string;
  fields: OutlineNodeFieldsConfig;
  headerClassName: string;
  contentClassName: string;
  separatorClassName?: string;
  showSeparator?: boolean;
  extraFieldsWrapperClassName?: string;
};

export type OutlineGroupConfig = {
  cardClassName: string;
  titleClassName: string;
  parentTitleFallback: string;
  footerClassName: string;
  addCardClassName: string;
  addLabel: string;
  addIconClassName: string;
};

export const LANDMARKS_SECTION_CONFIG: OutlineSectionConfig = {
  tutorialPage: 'landmarks',
  title: 'Landmarks',
  description:
    'Landmarks are points of interest in the scene. They can be places, people, objects, etc., and are immediately available to the player characters upon entering the scene.',
  textClassName:
    'my-8 flex items-center justify-center gap-4 text-primary max-sm:flex-col sm:gap-2',
  headingClassName:
    'flex w-full shrink-0 items-center gap-2 px-2 text-3xl sm:basis-1/3 sm:justify-center',
  titleClassName: '',
  descriptionClassName: 'px-2 text-sm text-base-content/75',
  icon: Pyramid,
  iconClassName: 'size-9',
  addButton: {
    label: 'Landmark',
    cardClassName:
      'mx-auto mb-4 w-[99%] rounded-full bg-primary/10 shadow-xl shadow-base-300 max-sm:w-11/12',
    buttonColor: 'ghost',
    buttonSize: 'block',
    icon: Plus,
    iconClassName: 'size-5',
  },
};

export const INTERACTABLES_SECTION_CONFIG: OutlineSectionConfig = {
  tutorialPage: 'interactables',
  title: 'Interactables',
  description:
    'Interactables are aspects of landmarks the player characters can interact with. They are revealed only when the player characters interact with their associated landmark.',
  textClassName: 'my-8 flex items-center justify-center gap-4 text-info max-sm:flex-col sm:gap-2',
  headingClassName:
    'flex w-full shrink-0 items-center gap-2 px-2 text-3xl sm:basis-1/3 sm:justify-center',
  titleClassName: '',
  descriptionClassName: 'px-2 text-sm text-base-content/75',
  icon: MousePointerClick,
  iconClassName: 'size-9',
  emptyState: {
    title: 'No landmarks found',
    description: 'Interactables need landmarks.',
    cardClassName:
      'mb-8 flex h-[7.5rem] w-full flex-col items-center justify-center bg-info/5 shadow-lg shadow-base-300',
    descriptionClassName: 'text-base-content/75',
  },
};

export const SECRETS_SECTION_CONFIG: OutlineSectionConfig = {
  tutorialPage: 'secrets',
  title: 'Secrets',
  description:
    'Secrets are hidden elements associated with an interactable that can only be revealed through player character deduction or rolls. They can be loot, information, traps, etc.',
  textClassName: 'my-8 flex items-center justify-center gap-4 text-error max-sm:flex-col sm:gap-2',
  headingClassName:
    'flex w-full shrink-0 items-center gap-2 px-2 text-3xl sm:basis-1/3 sm:justify-center',
  titleClassName: '',
  descriptionClassName: 'px-2 text-sm text-base-content/75',
  icon: Lock,
  iconClassName: 'size-9',
  emptyState: {
    title: 'No interactables found',
    description: 'Secrets need interactables.',
    cardClassName:
      'mb-8 flex h-[7.5rem] w-full flex-col items-center justify-center bg-error/5 shadow-lg shadow-base-300',
    descriptionClassName: 'text-base-content/75',
  },
};

export const LANDMARK_ITEM_CONFIG: OutlineNodeItemConfig = {
  deleteMessage: 'Delete Landmark',
  deleteItemFallback: 'this Landmark',
  fields: {
    nameLabel: 'Landmark Name',
    descriptionLabel: 'Landmark Description',
    namePlaceholder: 'Name',
    descriptionPlaceholder: 'Description',
  },
  headerClassName: 'relative pt-7',
  contentClassName: 'flex flex-col gap-4 max-sm:px-2',
  showSeparator: false,
};

export const INTERACTABLE_ITEM_CONFIG: OutlineNodeItemConfig = {
  deleteMessage: 'Delete Interactable',
  deleteItemFallback: 'this Interactable',
  srOnlyTypeLabel: 'Interactable',
  fields: {
    nameLabel: 'Interactable Name',
    descriptionLabel: 'Interactable Description',
    namePlaceholder: 'Name',
    descriptionPlaceholder: 'Description',
  },
  headerClassName: 'relative pt-7',
  contentClassName: 'flex flex-col gap-4 max-sm:px-2',
  separatorClassName: 'my-2 mb-0',
  showSeparator: true,
};

export const SECRET_ITEM_CONFIG: OutlineNodeItemConfig = {
  deleteMessage: 'Delete Secret',
  deleteItemFallback: 'this Secret',
  srOnlyTypeLabel: 'Secret',
  fields: {
    nameLabel: 'Secret Name',
    descriptionLabel: 'Secret Description',
    namePlaceholder: 'Name',
    descriptionPlaceholder: 'Description',
  },
  headerClassName: 'relative pt-7',
  contentClassName: 'flex flex-col gap-4 max-sm:px-2',
  separatorClassName: 'my-2 mb-0',
  showSeparator: true,
  extraFieldsWrapperClassName: 'max-sm:mx-[-0.5rem]',
};

export const INTERACTABLE_GROUP_CONFIG: OutlineGroupConfig = {
  cardClassName: 'relative mb-8 w-full bg-info/10 shadow-lg shadow-base-300 max-sm:rounded-none',
  titleClassName: 'absolute left-4 top-2.5 line-clamp-1 sm:left-8',
  parentTitleFallback: 'Landmark',
  footerClassName: 'mt-5 flex flex-col items-start gap-4',
  addCardClassName: 'mx-auto mb-2 w-[99%] rounded-full bg-info/10 shadow-xl shadow-base-300',
  addLabel: 'Interactable',
  addIconClassName: 'size-5',
};

export const SECRET_GROUP_CONFIG: OutlineGroupConfig = {
  cardClassName: 'relative mb-8 w-full bg-error/10 shadow-lg shadow-base-300 max-sm:rounded-none',
  titleClassName: 'absolute left-4 top-2.5 line-clamp-1 sm:left-8',
  parentTitleFallback: 'Interactable',
  footerClassName: 'mt-5 flex flex-col items-start gap-4',
  addCardClassName: 'mx-auto mb-2 w-[99%] rounded-full bg-error/10 shadow-xl shadow-base-300',
  addLabel: 'Secret',
  addIconClassName: 'size-5',
};

export const NODE_EDITABLE_FIELDS: readonly OutlineNodeField[] = [
  'name',
  'description',
  'rollableSuccess',
  'rollableFailure',
] as const;
