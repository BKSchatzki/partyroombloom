'use client';

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';

import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { useAtom } from 'jotai';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronRightCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { tutorialOutlineAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';

interface TutorialProps {
  builderPage: string;
  tutorialStep: number;
  setTutorialStep: Dispatch<SetStateAction<number>>;
  embla: any;
}

const Tutorial: React.FC<TutorialProps> = ({
  builderPage,
  tutorialStep: step,
  setTutorialStep,
  embla,
}) => {
  const [tutorialOutline, setTutorialOutline] = useAtom(tutorialOutlineAtom);

  const handleGoToStepPage = (page: string) => {
    switch (page) {
      case 'info':
        embla.scrollTo(0);
        break;
      case 'landmarks':
        embla.scrollTo(1);
        break;
      case 'interactables':
        embla.scrollTo(2);
        break;
      case 'secrets':
        embla.scrollTo(3);
        break;
      case 'review':
        embla.scrollTo(4);
        break;
      default:
        break;
    }
  };
  const handleGoToPrevStep = () => {
    steps[step - 1].setStateToStep();
    setTutorialStep((prev) => prev - 1);
  };
  const handleGoToNextStep = () => {
    steps[step + 1].setStateToStep();
    setTutorialStep((prev) => prev + 1);
  };

  const steps = [
    {
      id: 0,
      page: 'info',
      title: 'Welcome to PartyRoomBloom!',
      content: (
        <p>
          Feel free to look around. When you're ready, come back to this page and click or tap the{' '}
          <ArrowRight className={cn(`inline size-4`)} /> icon to continue with the tutorial.
        </p>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...tutorialOutline,
          title: 'Step 1',
        });
        embla.scrollTo(0);
      },
    },
    {
      id: 1,
      page: 'review',
      title: 'The Review Page',
      content: <p>This is the Review section.</p>,
      setStateToStep: () => {
        setTutorialOutline({
          ...tutorialOutline,
          title: 'Step 2',
        });
        embla.scrollTo(4);
      },
    },
  ];

  return (
    <Card className={cn(`bg-base-200 mt-4 shadow-md shadow-base-300 max-sm:rounded-none`)}>
      {steps[step].page === builderPage ? (
        <CardHeader>
          <div className={cn(`flex items-center justify-between`)}>
            <Button
              color={`ghost`}
              size={`sm`}
              onClick={handleGoToPrevStep}
              disabled={step <= 0}
              className={cn(`disabled:bg-transparent`)}
            >
              <ArrowLeft />
              <span className={cn(`sr-only`)}>Previous Step</span>
            </Button>
            <span className={cn(`text-center text-sm text-base-content/50`)}>
              {`Step ${step + 1}/${steps.length}`}
            </span>
            <Button
              color={`ghost`}
              size={`sm`}
              onClick={handleGoToNextStep}
              disabled={step >= steps.length - 1}
              className={cn(`disabled:bg-transparent`)}
            >
              <span className={cn(`sr-only`)}>Next Step</span>
              <ArrowRight />
            </Button>
          </div>
        </CardHeader>
      ) : (
        <CardHeader>
          <CardDescription className={cn(`text-base-content/50`)}>
            Glad you're looking around! Get back to the{' '}
            <button
              onClick={() => handleGoToStepPage(steps[step].page)}
              className={cn(
                `rounded-md bg-base-300 px-1 py-0.5 outline-none ring-base-content transition-all hover:bg-base-200 focus:bg-base-200 hover:text-base-content focus:text-base-content focus:ring-1`
              )}
            >
              {steps[step].page.charAt(0).toUpperCase() + steps[step].page.slice(1)} Page
            </button>{' '}
            to continue the tutorial
          </CardDescription>
        </CardHeader>
      )}
      {steps[step].page === builderPage && (
        <CardContent className={cn(`max-sm:p-1`)}>
          <Card className={cn(`bg-base-300 max-sm:rounded-none`)}>
            <CardHeader>
              <CardTitle>{steps[step].page === builderPage && steps[step].title}</CardTitle>
            </CardHeader>
            <CardContent className={cn(`text-sm`)}>
              {steps[step].page === builderPage && steps[step].content}
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
};

export default Tutorial;
