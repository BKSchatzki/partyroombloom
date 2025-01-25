'use client';

import React, { useEffect } from 'react';

import { useAtom } from 'jotai';
import {
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  outlineInit,
  tutorialOutlineAtom,
  tutorialStepAtom,
} from '@/lib/atoms';
import { tutorialOutlineFinal } from '@/lib/tutorial';
import { cn } from '@/lib/utils';

interface TutorialProps {
  builderPage: string;
  embla: any;
}

const Tutorial: React.FC<TutorialProps> = ({ builderPage, embla }) => {
  const [step, setStep] = useAtom(tutorialStepAtom);
  const [_, setTutorialOutline] = useAtom(tutorialOutlineAtom);

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
    setStep((prev) => prev - 1);
  };
  const handleGoToNextStep = () => {
    steps[step + 1].setStateToStep();
    setStep((prev) => prev + 1);
  };

  const steps = [
    {
      id: 0,
      page: 'info',
      title: 'Welcome to PartyRoomBloom!',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            This is the <span className={cn(`text-secondary`)}>Outline Builder</span>, where we
            draft scenes for our players to explore with their characters.
          </p>
          <p>
            Feel free to look around, and don't worry about messing anything up. Every time you go
            forward or back a step, the tutorial will update the scene with the right info for that
            step.
          </p>
          <p>
            When you're ready, come back to this page and click or tap the{' '}
            <ArrowRight className={cn(`inline size-4`)} /> icon above to continue with the tutorial.
          </p>
        </div>
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
            This is the page for the <span className={cn(`text-secondary`)}>Outline's</span> general
            information that we'll use to describe the scene to our players. It also provides
            helpful context for the{' '}
            <span className={cn(`text-indigo-400`)}>Simulate Assistant</span>.
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
          title: tutorialOutlineFinal.title,
        });
        embla.scrollTo(0);
      },
    },
    {
      id: 2,
      page: 'info',
      title: 'Describing the Scene',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            It's important to describe scenes to our players as their characters enter them. There
            aren't any wrong ways to do this, but it's recommended to engage the senses and include
            a little bit of movement to enliven the space.
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
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
        });
        embla.scrollTo(0);
      },
    },
    {
      id: 3,
      page: 'info',
      title: 'Why Are We Here?',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            For both our own reference and to help the{' '}
            <span className={cn(`text-indigo-400`)}>Simulate Assistant</span>, we should provide a
            direction for the scene.
          </p>
          <p>
            Since this is a simple loot room, we can just note that down, but let's include a
            reminder that this isn't a simple treasure room so that both we and the{' '}
            <span className={cn(`text-indigo-400`)}>Simulate Assistant</span> remember to make it
            exciting.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
        });
        embla.scrollTo(0);
      },
    },
    {
      id: 4,
      page: 'info',
      title: 'Adding Comments',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            We should provide some comments for extra context setting. This can be for ourselves,
            but the main purpose of this is to give the{' '}
            <span className={cn(`text-indigo-400`)}>Simulate Assistant</span> instructions on how to
            narrate, interpret, and extend the scene.
          </p>
          <p>
            Here, we're indicating to the{' '}
            <span className={cn(`text-indigo-400`)}>Simulate Assistant</span> that we'd like it to
            to world-build or give more loot if our players or their characters do particularly well
            in the scene.
          </p>
          <p>
            When you're ready, let's learn about the three-layered elements framework using{' '}
            <span className={cn(`text-primary`)}>Landmarks</span>,{' '}
            <span className={cn(`text-info`)}>Interactables</span>, and{' '}
            <span className={cn(`text-error`)}>Secrets</span>.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
        });
        embla.scrollTo(0);
      },
    },
    {
      id: 5,
      page: 'landmarks',
      title: 'The Three Layers',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            PartyRoomBloom's <span className={cn(`text-secondary`)}>Outline Builder</span> follows a
            battle-tested three-layered framework for designing exploration instances in tabletop
            gaming: <span className={cn(`text-primary`)}>Landmarks</span>,{' '}
            <span className={cn(`text-info`)}>Interactables</span>, and{' '}
            <span className={cn(`text-error`)}>Secrets</span>.
          </p>
          <p>
            <span className={cn(`text-primary`)}>Landmarks</span> are elements of a scene that are
            immediately noticeable by characters who enter it. They should be introduced after the
            initial description of the scene we just finished. You might say "As you enter this
            room, you see ..."
          </p>
          <p>
            Let's go learn about <span className={cn(`text-info`)}>Interactables</span>.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
        });
        embla.scrollTo(1);
      },
    },
    {
      id: 6,
      page: 'interactables',
      title: 'Interactables',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            <span className={cn(`text-info`)}>Interactables</span> are aspects of{' '}
            <span className={cn(`text-primary`)}>Landmarks</span> that characters notice when they{' '}
            <em>pay attention</em> to that <span className={cn(`text-primary`)}>Landmark</span>.
            They should be introduced when players choose to have their characters engage with the{' '}
            <span className={cn(`text-primary`)}>Landmark</span>. Imagine them saying "I want to go
            look at ..."
          </p>
          <p>
            We don't have any <span className={cn(`text-primary`)}>Landmarks</span>, so we cannot
            add anything here yet.
          </p>
          <p>
            Let's go learn about <span className={cn(`text-error`)}>Secrets</span>.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
        });
        embla.scrollTo(2);
      },
    },
    {
      id: 7,
      page: 'secrets',
      title: 'Secrets',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            <span className={cn(`text-error`)}>Secrets</span> are aspects of{' '}
            <span className={cn(`text-info`)}>Interactables</span> that are only revealed to
            characters when they <em>earn it</em>, whether that is through a good roll or inspired
            gameplay on the part of our players, at <em>our discretion</em>. The key is to not just
            give this information away freely. Imagine them saying "Would my character be able to
            ..."
          </p>
          <p>
            Likewise, we don't have any <span className={cn(`text-info`)}>Interactables</span> yet.
            So no <span className={cn(`text-error`)}>Secrets</span> can be added at the moment.
          </p>
          <p>
            Let's head back and add our first <span className={cn(`text-primary`)}>Landmark</span>.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
        });
        embla.scrollTo(3);
      },
    },
    {
      id: 8,
      page: 'landmarks',
      title: 'The First Landmark',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            Remember that platform in the center of this room? Let's place a treasure chest on it.
            It's quite prominent, considering how it is bathed in light and on a platform in the
            center of the room. A perfect candidate for a{' '}
            <span className={cn(`text-primary`)}>Landmark</span>.
          </p>
          <p>We've given it a meaningful name and description we can use when narrating it.</p>
          <p>
            Let's go add an <span className={cn(`text-info`)}>Interactable</span>.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
          elements: [tutorialOutlineFinal.elements[0]],
        });
        embla.scrollTo(1);
      },
    },
    {
      id: 9,
      page: 'interactables',
      title: 'Interactables, Unlocked',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            Ah! Since we've added a <span className={cn(`text-primary`)}>Landmark</span>, we can add
            an <span className={cn(`text-info`)}>Interactable</span> to it, so let's do that!
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
          elements: [tutorialOutlineFinal.elements[0]],
        });
        embla.scrollTo(2);
      },
    },
    {
      id: 10,
      page: 'interactables',
      title: 'A Big Lock',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            Let's give that chest a lock. Characters might not have noticed this right away, but if
            they approach it or pay attention, they'd be able to make it out without any difficulty.
          </p>
          <p>
            Take a wild guess as to how the <span className={cn(`text-error`)}>Secret</span> for
            this lock is going to work?
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
          elements: [tutorialOutlineFinal.elements[0], tutorialOutlineFinal.elements[1]],
        });
        embla.scrollTo(2);
      },
    },
    {
      id: 11,
      page: 'secrets',
      title: 'Gold Bars',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            Whoa, this page is a little different from the other two.{' '}
            <span className={cn(`text-error`)}>Secrets</span> also include{' '}
            <span className={cn(`text-warning`)}>Rollable</span> conditions for success and failure,
            usually as a result of creative play or dice rolls.
          </p>
          <p>
            Remember, everything about these <span className={cn(`text-error`)}>Secrets</span> is
            hidden information. The massive pile of gold bars is only shown to players if they are
            able to resolve the <span className={cn(`text-info`)}>Interactable</span>. Whether they
            do it in a way you expect or surprise you is up to them.
          </p>
          <p>
            Let's add in the <span className={cn(`text-warning`)}>Rollables</span> to expound on the
            success and fail triggers and results.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
          elements: [
            tutorialOutlineFinal.elements[0],
            tutorialOutlineFinal.elements[1],
            {
              ...tutorialOutlineFinal.elements[2],
              rollableSuccess: '',
              rollableFailure: '',
            },
          ],
        });
        embla.scrollTo(3);
      },
    },
    {
      id: 12,
      page: 'secrets',
      title: 'Rollables',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            Okay, we've written out three ways our players can get the chest open. Whether they
            think of anything else is out of our control. Such is the{' '}
            <span className={cn(`text-base-content/50 line-through`)}>plight</span> privilege of us
            game masters.
          </p>
          <p>
            We've also left a bit of a note for the failure condition suggesting that we can make up
            something fun depending on how badly our players mess this up. Flavor is always good!
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
          elements: [
            tutorialOutlineFinal.elements[0],
            tutorialOutlineFinal.elements[1],
            tutorialOutlineFinal.elements[2],
          ],
        });
        embla.scrollTo(3);
      },
    },
    {
      id: 13,
      page: 'secrets',
      title: 'Multiple Secrets',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            We can add multiple <span className={cn(`text-error`)}>Secrets</span> to a single{' '}
            <span className={cn(`text-info`)}>Interactable</span>. Let's make the actual lock a
            little more interesting.
          </p>
          <p>
            Since we don't plan scenes in a vacuum, we ought to drop specific references to people,
            places, settings in our descriptions of the elements or the{' '}
            <span className={cn(`text-warning`)}>Rollables</span>.
          </p>
          <p>
            In this example, we are giving observant characters the stunning information that the
            lock itself is of modern design, and rewarding especially inspired gameplay with world
            knowledge about a long-gone civilization, as well as a potential lead on tracking down
            who made these locks.
          </p>
          <p>
            With this single <span className={cn(`text-error`)}>Secret</span>, we've introduced an
            entry point to a potential plotline that our players would have otherwise missed or had
            to find some other way to discover.
          </p>
          <p>
            Remember, this was supposed to be an optional treasure room. Our players should feel
            immensely rewarded when we allow their characters and creativity to drive progress like
            this.
          </p>
          <p>
            Let's use this to inspire another <span className={cn(`text-info`)}>Interactable</span>{' '}
            on the "Lone Chest" <span className={cn(`text-primary`)}>Landmark</span>.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
          elements: [
            tutorialOutlineFinal.elements[0],
            tutorialOutlineFinal.elements[1],
            tutorialOutlineFinal.elements[2],
            tutorialOutlineFinal.elements[3],
          ],
        });
        embla.scrollTo(3);
      },
    },
    {
      id: 14,
      page: 'interactables',
      title: 'Flavorful Interactables',
      content: (
        <div className={cn(`space-y-2`)}>
          <p>
            Since we referenced that ancient civilization in that second{' '}
            <span className={cn(`text-error`)}>Secret</span>, why not add some flavor to the chest
            by making it known to the characters that it is most certainly of said civilization?
          </p>
          <p>
            We don't need to add any <span className={cn(`text-error`)}>Secrets</span> to this{' '}
            <span className={cn(`text-info`)}>Interactable</span>. This doesn't mean our players
            won't be able to follow up on this; rather, it just means we haven't planned anything,
            and doesn't preclude us improvising a spur-of-the-moment{' '}
            <span className={cn(`text-error`)}>Secret</span>. The{' '}
            <span className={cn(`text-indigo-400`)}>Simulate Assistant</span> might in fact choose
            to extend the scene here, adding a secret of its own to give us some new ideas.
          </p>
          <p>
            Let's add a bit of jeopardy around the chest by adding another{' '}
            <span className={cn(`text-primary`)}>Landmark</span>.
          </p>
        </div>
      ),
      setStateToStep: () => {
        setTutorialOutline({
          ...outlineInit,
          title: tutorialOutlineFinal.title,
          description: tutorialOutlineFinal.description,
          goal: tutorialOutlineFinal.goal,
          comments: tutorialOutlineFinal.comments,
          elements: [
            tutorialOutlineFinal.elements[0],
            tutorialOutlineFinal.elements[1],
            tutorialOutlineFinal.elements[2],
            tutorialOutlineFinal.elements[3],
            tutorialOutlineFinal.elements[4],
          ],
        });
        embla.scrollTo(2);
      },
    },
  ];

  useEffect(() => {
    if (!embla) {
      return;
    }
    handleGoToStepPage(steps[step].page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embla]);

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
            to continue the tutorial.
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
