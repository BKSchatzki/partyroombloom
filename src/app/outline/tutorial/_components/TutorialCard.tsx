'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
} from 'react';

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
import { TutorialStep } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ActionPromptProps {
  children: React.ReactNode;
}

const ActionPromptComponent: React.FC<ActionPromptProps> = ({ children }) => {
  return (
    <div className={cn(`pt-2`)}>
      <div className={cn(`flex gap-2 rounded-md bg-secondary/25 p-2`)}>
        <ArrowRight
          aria-hidden={true}
          className={cn(`size-5 shrink-0`)}
        />
        <p>{children}</p>
      </div>
    </div>
  );
};
const ActionPrompt = React.memo(ActionPromptComponent);
ActionPrompt.displayName = 'ActionPrompt';

interface TutorialProps {
  builderPage: string;
  embla: any;
}

const TutorialCardComponent: React.FC<TutorialProps> = ({ builderPage, embla }) => {
  const [step, setStep] = useAtom(tutorialStepAtom);
  const [_, setTutorialOutline] = useAtom(tutorialOutlineAtom);

  const steps: TutorialStep[] = useMemo(
    () => [
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
              forward or back a step, the tutorial will update the scene with the right info for
              that step. The UI is only enabled here so you can mess around, and won't affect the
              progression of the tutorial.
            </p>
            <ActionPrompt>
              When you're ready, come back to this page and click or tap the{' '}
              <ArrowRight
                aria-hidden={true}
                className={cn(`inline size-4`)}
              />{' '}
              icon above to continue with the tutorial. We'll start with the "Title."
            </ActionPrompt>
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
              This is the page for the <span className={cn(`text-secondary`)}>Outline's</span>{' '}
              general information that we'll use to describe the scene to our players. It also
              provides helpful context for the{' '}
              <span className={cn(`text-indigo-400`)}>Simulate Assistant</span>.
            </p>
            <p>
              In this tutorial, we're going to be building a small loot room in a dungeon, so let's
              just call it "Secret Treasure Room."
            </p>
            <ActionPrompt>Go to the next step to learn how to write a "Description."</ActionPrompt>
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
              aren't any wrong ways to do this, but it's recommended to engage the senses and
              include a little bit of movement to enliven the space.
            </p>
            <p>
              Here, we've described the material and size of the room, the smell and temperature of
              the air, the sound of the characters' footsteps, and drawn our players' attention to
              the center of the room with a (lack of) movement.
            </p>
            <ActionPrompt>
              Go to the next step to learn the purpose of a "Goal" and how to write one.
            </ActionPrompt>
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
            <ActionPrompt>
              Go to the next step to learn about the "Comments" field and how to best use it.
            </ActionPrompt>
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
              <span className={cn(`text-indigo-400`)}>Simulate Assistant</span> instructions on how
              to narrate, interpret, and extend the scene.
            </p>
            <p>
              Here, we're indicating to the{' '}
              <span className={cn(`text-indigo-400`)}>Simulate Assistant</span> that we'd like it to
              to world-build or give more loot if our players or their characters do particularly
              well in the scene.
            </p>
            <p>
              Now that we're done filling in the general information, it's time to move on to the
              meat of the <span className={cn(`text-secondary`)}>Outline Builder</span>.
            </p>
            <ActionPrompt>
              When you're ready, go to the next step to learn about the three-layered elements
              framework using <span className={cn(`text-primary`)}>Landmarks</span>,{' '}
              <span className={cn(`text-info`)}>Interactables</span>, and{' '}
              <span className={cn(`text-error`)}>Secrets</span>.
            </ActionPrompt>
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
              PartyRoomBloom's <span className={cn(`text-secondary`)}>Outline Builder</span> follows
              a battle-tested three-layered framework for designing exploration instances in
              tabletop gaming: <span className={cn(`text-primary`)}>Landmarks</span>,{' '}
              <span className={cn(`text-info`)}>Interactables</span>, and{' '}
              <span className={cn(`text-error`)}>Secrets</span>.
            </p>
            <p>
              <span className={cn(`text-primary`)}>Landmarks</span> are elements of a scene that are
              immediately noticeable by characters who enter it. They should be introduced after the
              initial description of the scene we just finished. You might say "As you enter this
              room, you see ..."
            </p>
            <ActionPrompt>
              Go to the next step to learn about{' '}
              <span className={cn(`text-info`)}>Interactables</span>.
            </ActionPrompt>
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
              <span className={cn(`text-primary`)}>Landmark</span>. Imagine them saying "I want to
              go look at ..."
            </p>
            <p>
              We don't have any <span className={cn(`text-primary`)}>Landmarks</span>, so we cannot
              add anything here yet.
            </p>
            <ActionPrompt>
              Go to the next step to learn about <span className={cn(`text-error`)}>Secrets</span>.
            </ActionPrompt>
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
              gameplay on the part of our players, at <em>our discretion</em>. The key is to not
              just give this information away freely. Imagine them saying "Would my character be
              able to ..."
            </p>
            <p>
              Likewise, we don't have any <span className={cn(`text-info`)}>Interactables</span>{' '}
              yet. So no <span className={cn(`text-error`)}>Secrets</span> can be added at the
              moment.
            </p>
            <ActionPrompt>
              Let's start adding some elements to fill out the scene. Go to the next step to see how
              we've added our first <span className={cn(`text-primary`)}>Landmark</span>.
            </ActionPrompt>
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
            <ActionPrompt>
              Now that we have a <span className={cn(`text-primary`)}>Landmark</span>, let's go add
              an <span className={cn(`text-info`)}>Interactable</span>. Go to the next step to check
              out the <span className={cn(`text-info`)}>Interactables</span> page.
            </ActionPrompt>
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
              Ah! Since we've added a <span className={cn(`text-primary`)}>Landmark</span>, we can
              add an <span className={cn(`text-info`)}>Interactable</span> to it, so let's do that!
            </p>
            <ActionPrompt>
              Go to the next step to see what it looks like after we've added an{' '}
              <span className={cn(`text-info`)}>Interactable</span>.
            </ActionPrompt>
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
              Let's give that chest a lock. Characters might not have noticed this right away, but
              if they approach it or pay attention, they'd be able to make it out without any
              difficulty.
            </p>
            <p>
              Take a wild guess as to how the <span className={cn(`text-error`)}>Secret</span> for
              this lock is going to work?
            </p>
            <ActionPrompt>
              Go to the next step to switch to the <span className={cn(`text-error`)}>Secrets</span>{' '}
              page and check out the <span className={cn(`text-error`)}>Secret</span> we've added.
            </ActionPrompt>
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
              <span className={cn(`text-warning`)}>Rollable</span> conditions for success and
              failure, usually as a result of creative play or dice rolls.
            </p>
            <p>
              Remember, everything about these <span className={cn(`text-error`)}>Secrets</span> is
              hidden information. The massive pile of gold bars is only shown to players if they are
              able to resolve the <span className={cn(`text-info`)}>Interactable</span>. Whether
              they do it in a way you expect or surprise you is up to them.
            </p>
            <ActionPrompt>
              Go to the next step to see how filling out the{' '}
              <span className={cn(`text-warning`)}>Rollables</span> helps us expound on the success
              and fail triggers and results.
            </ActionPrompt>
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
              <span className={cn(`text-base-content/50 line-through`)}>plight</span> privilege of
              us game masters.
            </p>
            <p>
              We've also left a bit of a note for the failure condition suggesting that we can make
              up something fun depending on how badly our players mess this up. Flavor is always
              good!
            </p>
            <ActionPrompt>
              Go to the next step to check out how we can add multiple{' '}
              <span className={cn(`text-error`)}>Secrets</span> and how they can help flesh out a
              scene.
            </ActionPrompt>
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
              Since we don't plan scenes in a vacuum, we ought to drop specific references to
              people, places, settings in our descriptions of the elements or the{' '}
              <span className={cn(`text-warning`)}>Rollables</span>.
            </p>
            <p>(If you're on a smaller screen, you might want to scroll down for this one.)</p>
            <p>
              In this example, we are giving observant characters the stunning information that the
              lock itself is of modern design, and rewarding especially inspired gameplay with world
              knowledge about a long-gone civilization, as well as a potential lead on tracking down
              who made these locks.
            </p>
            <p>
              With this single <span className={cn(`text-error`)}>Secret</span>, we've introduced an
              entry point to a potential plotline that our players would have otherwise missed or
              had to find some other way to discover.
            </p>
            <p>
              Remember, this was supposed to be an optional treasure room. Our players should feel
              immensely rewarded when we allow their characters and creativity to drive progress
              like this.
            </p>
            <p>
              Let's use this to inspire another{' '}
              <span className={cn(`text-info`)}>Interactable</span> on the "Lone Chest"{' '}
              <span className={cn(`text-primary`)}>Landmark</span>.
            </p>
            <ActionPrompt>
              Go to the next step to see another added{' '}
              <span className={cn(`text-info`)}>Interactable</span> on our one{' '}
              <span className={cn(`text-primary`)}>Landmark</span>.
            </ActionPrompt>
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
            <ActionPrompt>
              Go to the next step to see a second{' '}
              <span className={cn(`text-primary`)}>Landmark</span> and how we will use it to spice
              up the scene.
            </ActionPrompt>
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
      {
        id: 15,
        page: 'landmarks',
        title: 'A Second Landmark',
        content: (
          <div className={cn(`space-y-2`)}>
            <p>
              We've added a ring of light around the platform. This is a great{' '}
              <span className={cn(`text-primary`)}>Landmark</span> and it sure to get our players'
              attention (or suspicion).
            </p>
            <p>
              We've made it blindingly bright, but not immediately dangerous to our players. Not
              that that's going to last, seeing as how that treasure chest is in the middle of the
              platform.
            </p>
            <ActionPrompt>
              Go to the next step to check out how we develop this{' '}
              <span className={cn(`text-primary`)}>Landmark</span> with an{' '}
              <span className={cn(`text-info`)}>Interactable</span>.
            </ActionPrompt>
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
              tutorialOutlineFinal.elements[5],
            ],
          });
          embla.scrollTo(1);
        },
      },
      {
        id: 16,
        page: 'interactables',
        title: 'Brighter and Brighter',
        content: (
          <div className={cn(`space-y-2`)}>
            <p>
              They're not getting this chest for free. Since this is an obvious phenomenon that
              happens when the platform <span className={cn(`text-primary`)}>Landmark</span> is
              "triggered," we can describe this in great detail.
            </p>
            <p>
              Very few players at this point will be oblivious to the danger. Of course, we could
              totally mess with them and make this light show purely ceremonial, but let's play it
              straight and figure out how players can resolve this on the{' '}
              <span className={cn(`text-error`)}>Secrets</span> page.
            </p>
            <ActionPrompt>
              Go to the next step to see how we're going to follow up on this dangerous{' '}
              <span className={cn(`text-info`)}>Interactable</span> on the{' '}
              <span className={cn(`text-error`)}>Secrets</span> page.
            </ActionPrompt>
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
              tutorialOutlineFinal.elements[5],
              tutorialOutlineFinal.elements[6],
            ],
          });
          embla.scrollTo(2);
        },
      },
      {
        id: 17,
        page: 'secrets',
        title: 'Holy Sun Laser',
        content: (
          <div className={cn(`space-y-2`)}>
            <p>(You might have to scroll down to see this one.)</p>
            <p>
              This <span className={cn(`text-error`)}>Secret</span> is, surprise, a trap. Here, the
              description details ways that they may avoid the trap, and the{' '}
              <span className={cn(`text-warning`)}>Rollables</span> describe <em>how</em> they might
              go about finding this out, either with knowledge rolls or clever play.
            </p>
            <p>
              This is a good set of elements. Let's go to the final page of the{' '}
              <span className={cn(`text-secondary`)}>Outline Builder</span> and how we can print and
              back up what we've made,
            </p>
            <ActionPrompt>Go to the next step to review and back up our scene.</ActionPrompt>
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
              tutorialOutlineFinal.elements[5],
              tutorialOutlineFinal.elements[6],
              tutorialOutlineFinal.elements[7],
            ],
          });
          embla.scrollTo(3);
        },
      },
      {
        id: 18,
        page: 'review',
        title: 'Checking Our Work',
        content: (
          <div className={cn(`space-y-2`)}>
            <p>
              This final page helps us see our work all in one place. This is a good final place to
              proofread our work before we save and download it.
            </p>
            <p>
              Since this is just a tutorial, saving is disabled. But, we've saved the best part for
              last. Check out the <span className={cn(`text-orange-500`)}>Manage Menu</span>. We can
              download a PDF version of this <span className={cn(`text-secondary`)}>Outline</span>{' '}
              to use however we wish. We can also download a JSON backup to reupload to a{' '}
              <span className={cn(`text-secondary`)}>New Outline</span>.
            </p>
            <p>
              Since this is just a tutorial, saving and restoring from a JSON file are disabled.
            </p>
            <p>
              Nice work following along! Hopefully by now the concept is clear and you can get
              started building. You ideal next steps are below.
            </p>
            <ActionPrompt>
              Download a PDF to save the <span className={cn(`text-secondary`)}>Outline</span>, and
              if you want to use this scene yourself, download the JSON, create an account, and when
              on a <span className={cn(`text-secondary`)}>New Outline Builder</span>, restore it
              from JSON, then save it. You will then have your own copy of this scene to do with
              whatever you wish, including plugging it into our{' '}
              <span className={cn(`text-indigo-400`)}>Simulate Assistant</span> to take the scene
              beyond!
            </ActionPrompt>
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
              tutorialOutlineFinal.elements[5],
              tutorialOutlineFinal.elements[6],
              tutorialOutlineFinal.elements[7],
            ],
          });
          embla.scrollTo(4);
        },
      },
    ],
    [embla, setTutorialOutline]
  );

  const handleGoToStepPage = useCallback(
    (page: string) => {
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
    },
    [embla]
  );
  const handleGoToPrevStep = useCallback(() => {
    steps[step - 1].setStateToStep();
    setStep((prev) => prev - 1);
  }, [setStep, step, steps]);
  const handleGoToNextStep = useCallback(() => {
    steps[step + 1].setStateToStep();
    setStep((prev) => prev + 1);
  }, [setStep, step, steps]);

  useEffect(() => {
    if (!embla) {
      return;
    }
    steps[step].setStateToStep();
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

const TutorialCard = React.memo(TutorialCardComponent);
TutorialCard.displayName = 'TutorialCard';
export default TutorialCardComponent;
