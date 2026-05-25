'use client';

import React from 'react';

import { useAtomValue } from 'jotai';
import type { CarouselApi } from '@/components/ui/carousel';
import { rootLandmarkIdsAtomFamily } from '@/lib/atoms';
import { getOutlineMode } from '@/lib/outlineState';

import Interactables from './Interactable';
import OutlineNodeSection from './OutlineNodeSection';
import { INTERACTABLES_SECTION_CONFIG } from './outlineNodeConfig';

interface InteractablesContainerProps {
  outlineId: number | null;
  tutorialMode: boolean;
  embla?: CarouselApi;
}

const InteractablesContainerComponent: React.FC<InteractablesContainerProps> = ({
  outlineId,
  tutorialMode,
  embla,
}) => {
  const mode = getOutlineMode(tutorialMode, outlineId);
  const landmarkIds = useAtomValue(rootLandmarkIdsAtomFamily(mode));

  return (
    <OutlineNodeSection
      tutorialMode={tutorialMode}
      embla={embla}
      itemIds={landmarkIds}
      sectionConfig={INTERACTABLES_SECTION_CONFIG}
      renderItem={(landmarkId) => (
        <Interactables
          key={landmarkId}
          elementId={landmarkId}
          outlineId={outlineId}
          tutorialMode={tutorialMode}
        />
      )}
    />
  );
};
const InteractablesContainer = React.memo(InteractablesContainerComponent);
InteractablesContainer.displayName = 'InteractablesContainer';
export default InteractablesContainer;
