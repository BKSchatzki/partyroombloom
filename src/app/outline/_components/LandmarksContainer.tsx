'use client';

import React, { useCallback } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import type { CarouselApi } from '@/components/ui/carousel';
import { addLandmarkAtomFamily, rootLandmarkIdsAtomFamily } from '@/lib/atoms';
import { getOutlineMode } from '@/lib/outlineState';

import Landmarks from './Landmark';
import OutlineNodeSection from './OutlineNodeSection';
import { LANDMARKS_SECTION_CONFIG } from './outlineNodeConfig';

interface LandmarksProps {
  outlineId: number | null;
  tutorialMode: boolean;
  embla?: CarouselApi;
}

const LandmarksContainerComponent: React.FC<LandmarksProps> = ({
  outlineId,
  tutorialMode,
  embla,
}) => {
  const mode = getOutlineMode(tutorialMode, outlineId);
  const landmarkIds = useAtomValue(rootLandmarkIdsAtomFamily(mode));
  const addLandmark = useSetAtom(addLandmarkAtomFamily(mode));

  const handleAddLandmark = useCallback(() => {
    addLandmark();
  }, [addLandmark]);

  return (
    <OutlineNodeSection
      tutorialMode={tutorialMode}
      embla={embla}
      itemIds={landmarkIds}
      sectionConfig={LANDMARKS_SECTION_CONFIG}
      onAdd={handleAddLandmark}
      renderItem={(landmarkId) => (
        <Landmarks
          key={landmarkId}
          elementId={landmarkId}
          outlineId={outlineId}
          tutorialMode={tutorialMode}
        />
      )}
    />
  );
};
const LandmarksContainer = React.memo(LandmarksContainerComponent);
LandmarksContainer.displayName = 'LandmarksContainer';
export default LandmarksContainer;
