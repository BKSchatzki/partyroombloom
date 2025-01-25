'use client';

import React, { Dispatch, SetStateAction } from 'react';

import { useAtom } from 'jotai';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { outlineInit, tutorialOutlineAtom, tutorialOutlineInit } from '@/lib/atoms';
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
        setTutorialOutline(outlineInit);
        embla.scrollTo(0);
      },
    },
    {
      id: 1,
      page: 'info',
      title: 'The Info Page',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            This is the page for the scene's general information that you'll use to describe the
            scene to your players. If you are using the{' '}
            <span className={cn(`text-indigo-500`)}>Simulate</span> feature, it also provides
            helpful context for the assistant.
          </p>
          <p>
            In this tutorial, we're going to be building a small loot room in a dungeon, so let's
            just call it "Secret Treasure Room."
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineInit.title,
        });
      },
    },
    {
      id: 2,
      page: 'info',
      title: 'Describing the Scene',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            It's important to describe scenes to your players as you enter them. There aren't any
            wrong ways to do this, but it's recommended to engage the senses and include a little
            bit of movement to enliven the space.
          </p>
          <p>
            Here, we've described the material and size of the room, the smell and temperature of
            the air, the sound of the characters' footsteps, and drawn our players' attention to the
            center of the room with a (lack of) movement.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineInit.title,
          description: tutorialOutlineInit.description,
        });
      },
    },
    {
      id: 3,
      page: 'info',
      title: 'Why Are We Here?',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            For our own records and the <span className={cn(`text-indigo-500`)}>Simulate</span>{' '}
            assistant, we should provide a direction for the scene.
          </p>
          <p>
            Since this is a simple loot room, we can just note that down, but let's make sure that
            there's a bit of jeopardy, so we'll include a reminder that this isn't a simple treasure
            room.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineInit.title,
          description: tutorialOutlineInit.description,
          goal: tutorialOutlineInit.goal,
        });
      },
    },
    {
      id: 4,
      page: 'info',
      title: 'Adding Comments',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            Last but not least, we are going to provide some comments for extra context setting.
            This can be for yourself, but the main purpose of this is to give the{' '}
            <span className={cn(`text-indigo-500`)}>Simulate</span> assistant instructions of how to
            narrate, interpret, and extend the scene.
          </p>
          <p>
            Here, we're allowing the assistant to world-build or give more loot if the players or
            their characters do particularly well in the scene.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineInit.title,
          description: tutorialOutlineInit.description,
          goal: tutorialOutlineInit.goal,
          comments: tutorialOutlineInit.comments,
        });
      },
    },
  ];

  return (
    <Card className={cn(`bg-base-200 my-4 shadow-md shadow-base-300 max-sm:rounded-none`)}>
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
