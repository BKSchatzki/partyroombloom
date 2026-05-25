'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import type { CarouselApi } from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import TutorialCardComponent from '../tutorial/_components/TutorialCard';
import { OutlineSectionConfig } from './outlineNodeConfig';

interface OutlineNodeSectionProps {
  tutorialMode: boolean;
  embla?: CarouselApi;
  itemIds: string[];
  sectionConfig: OutlineSectionConfig;
  renderItem: (itemId: string) => React.ReactNode;
  onAdd?: () => void;
}

const OutlineNodeSectionComponent: React.FC<OutlineNodeSectionProps> = ({
  tutorialMode,
  embla,
  itemIds,
  sectionConfig,
  renderItem,
  onAdd,
}) => {
  const Icon = sectionConfig.icon;
  const AddIcon = sectionConfig.addButton?.icon;
  const shouldShowEmptyState = Boolean(sectionConfig.emptyState) && itemIds.length === 0;
  const shouldShowAddButton = Boolean(sectionConfig.addButton && onAdd);

  return (
    <ScrollArea className={cn(`flex h-[calc(100vh-9rem)] flex-col gap-4 sm:px-4`)}>
      {tutorialMode && (
        <TutorialCardComponent
          builderPage={sectionConfig.tutorialPage}
          embla={embla}
        />
      )}
      {!tutorialMode && (
        <section className={cn(sectionConfig.textClassName)}>
          <h2 className={cn(sectionConfig.headingClassName, sectionConfig.titleClassName)}>
            <Icon
              aria-hidden={true}
              className={cn(sectionConfig.iconClassName)}
            />
            {sectionConfig.title}
          </h2>
          <p className={cn(sectionConfig.descriptionClassName)}>{sectionConfig.description}</p>
        </section>
      )}
      {shouldShowEmptyState ? (
        <Card className={cn(sectionConfig.emptyState?.cardClassName)}>
          <CardTitle>{sectionConfig.emptyState?.title}</CardTitle>
          <CardDescription className={cn(sectionConfig.emptyState?.descriptionClassName)}>
            {sectionConfig.emptyState?.description}
          </CardDescription>
        </Card>
      ) : (
        itemIds.map((itemId) => renderItem(itemId))
      )}
      {shouldShowAddButton && sectionConfig.addButton && AddIcon && (
        <Card className={cn(sectionConfig.addButton.cardClassName)}>
          <Button
            color={sectionConfig.addButton.buttonColor}
            onClick={onAdd}
            size={sectionConfig.addButton.buttonSize}
          >
            <AddIcon
              aria-hidden={true}
              className={cn(sectionConfig.addButton.iconClassName)}
            />{' '}
            {sectionConfig.addButton.label}
          </Button>
        </Card>
      )}
    </ScrollArea>
  );
};

const OutlineNodeSection = React.memo(OutlineNodeSectionComponent);
OutlineNodeSection.displayName = 'OutlineNodeSection';

export default OutlineNodeSection;
