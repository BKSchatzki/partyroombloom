'use client';

import React from 'react';

import { useAtomValue } from 'jotai';
import type { CarouselApi } from '@/components/ui/carousel';
import { allInteractableIdsAtomFamily } from '@/lib/atoms';
import { getOutlineMode } from '@/lib/outlineState';

import Secrets from './Secret';
import OutlineNodeSection from './OutlineNodeSection';
import { SECRETS_SECTION_CONFIG } from './outlineNodeConfig';

interface SecretsContainerProps {
  outlineId: number | null;
  tutorialMode: boolean;
  embla?: CarouselApi;
}

const SecretsContainerComponent: React.FC<SecretsContainerProps> = ({
  outlineId,
  tutorialMode,
  embla,
}) => {
  const mode = getOutlineMode(tutorialMode, outlineId);
  const interactableIds = useAtomValue(allInteractableIdsAtomFamily(mode));

  return (
    <OutlineNodeSection
      tutorialMode={tutorialMode}
      embla={embla}
      itemIds={interactableIds}
      sectionConfig={SECRETS_SECTION_CONFIG}
      renderItem={(interactableId) => (
        <Secrets
          key={interactableId}
          elementId={interactableId}
          outlineId={outlineId}
          tutorialMode={tutorialMode}
        />
      )}
    />
  );
};
const SecretsContainer = React.memo(SecretsContainerComponent);
SecretsContainer.displayName = 'SecretsContainer';
export default SecretsContainer;
