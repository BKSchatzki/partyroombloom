import React from 'react';

import {
  Coins,
  GraduationCap,
  Save,
  Sparkles,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Faq = () => {
  const questions = [
    {
      question: 'What is the premise of PartyRoomBloom?',
      answer: (
        <p>
          The goal of PartyRoomBloom is to make planning and running aspects of your sessions
          easier. At the moment, our main attraction is the{' '}
          <span className={cn(`text-secondary`)}>Outline Builder</span>, a tool designed on a
          framework that presents information to players in layers. This framework provides a good
          balance of convenience, structure, and potential for emergent gameplay. We've also
          designed the <span className={cn(`text-indigo-500`)}>Simulate Assistant</span>, an AI
          narrator designed to extend scenes in order to generate new ideas for you while planning.
        </p>
      ),
    },
    {
      question: "Couldn't I just plan with a text editor? Why use this?",
      answer: (
        <>
          <p>
            You absolutely could, and if that's how you work best, then this tool might seem a
            little redundant. However, the interface of the{' '}
            <span className={cn(`text-secondary`)}>Outline Builder</span> is designed to keep you
            focused on information layers, and the mental ergonomics of this are worth using the
            tool.
          </p>{' '}
          <p>
            Once you have built several scenes, you will also be able to reference them very easily
            in the <span className={cn(`text-info`)}>Overview Page</span>, which absolutely beats
            sifting through documents. You may have a system you are perfectly happy with, but we
            believe PartyRoomBloom is still worth a try.
          </p>
        </>
      ),
    },
    {
      question: 'Is the Simulate Assistant a replacement for game masters?',
      answer: (
        <>
          <p>
            Absolutely not. We abhor the "replace human creativity" talk currently streaking through
            the tech and business world, and the tabletop community is full of creatives who deserve
            respect for the love they pour into their craft, game masters included.
          </p>
          <p>
            The <span className={cn(`text-indigo-500`)}>Simulate Assistant</span> is a brainstorming
            tool off of which you can bounce ideas, and is best used when your scenes are already
            well-developed and you feed it as much context as possible. It would make an exceedingly
            poor game master, in no small part due to its deliberate design to be bad at that exact
            job.
          </p>
        </>
      ),
    },
    {
      question: 'What is the best way to use the Simulate Assistant?',
      answer: (
        <>
          <p>
            Make sure that you do the{' '}
            <span className={cn(`text-primary`)}>
              <GraduationCap
                aria-hidden={true}
                className={cn(`inline size-4`)}
              />{' '}
              Tutorial
            </span>{' '}
            in order to understand how best to construct a scene to feed it.
          </p>
          <p>
            Key considerations are: using proper nouns in your scenes to allow it to refer to them
            during the conversation, specifying consequences for successes and failures when writing
            elements at the <span className={cn(`text-error`)}>Secret</span> layer, and thinking
            like a player, using the text box in addition to selecting an action when going through
            the conversation with the{' '}
            <span className={cn(`text-indigo-500`)}>Simulate Assistant</span>.
          </p>
        </>
      ),
    },
    {
      question: 'Is PartyRoomBloom free?',
      answer: (
        <>
          <p>
            The <span className={cn(`text-secondary`)}>Outline Builder</span>,{' '}
            <span className={cn(`text-info`)}>Overview Page</span>, and all features related to
            printing PDFs and backing up scene data locally on your machine are free. The{' '}
            <span className={cn(`text-indigo-500`)}>Simulate Assistant</span> requires one credit
            per interaction.
          </p>
          <p>
            The amount of credits you have is found on every button you can press that would require
            one, usually marked with a{' '}
            <Sparkles
              aria-hidden={true}
              className={cn(`inline size-4`)}
            />{' '}
            sparkly icon and a{' '}
            <Coins
              aria-hidden={true}
              className={cn(`inline size-4`)}
            />{' '}
            count . If those icons aren't on the button, it doesn't cost a credit. Upon account
            creation you will receive 50 free credits, so make sure you use them wisely!
          </p>
          <p>
            As we are currently in beta, there is no way to purchase more credits at the moment, but
            feel free to contact us and we will trade you credits for meaningful feedback and
            testing on your part.
          </p>
        </>
      ),
    },
    {
      question: 'Are you going to steal my data?',
      answer: (
        <>
          <p>
            The only data of yours we store are your Google ID, email, name, and avatar. The scenes
            you build with the <span className={cn(`text-secondary`)}>Outline Builder</span> that
            you save with us, along with any conversations you have with the{' '}
            <span className={cn(`text-indigo-500`)}>Simulate Assistant</span>, are associated with
            your account. Deleted scenes and conversations are not kept; even elements of an outline
            you delete are gone forever.
          </p>
          <p>
            You may notice that the <span className={cn(`text-secondary`)}>Outline Builder</span>{' '}
            sometimes remembers what you were working on; that's your browser saving the
            information, not our databases. We don't see it until you click the{' '}
            <Save
              aria-hidden={true}
              className={cn(`inline size-4`)}
            />{' '}
            Save button.
          </p>
          <p>
            We can't speak to what the AI that runs the{' '}
            <span className={cn(`text-indigo-500`)}>Simulate Assistant</span> does, but since
            requests to the AI are from PartyRoomBloom, it is actually more anonymized than if you
            were using a chatbot by yourself.
          </p>
          <p>
            We have no interest in using any of your information other than to provide this tool for
            you, and if you ever wanted to delete your account, contact us and we'll make it happen.
            A record of these account deletion requests will be kept to prevent abuse of the free
            credits on sign up.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className={cn(`bg-gradient-to-b from-indigo-950 to-neutral px-4 pb-16 pt-16 sm:px-16`)}>
      <Card className={cn(`bg-base-100/50 shadow-xl shadow-base-300`)}>
        <Accordion
          type="single"
          collapsible
        >
          {questions.map((question, index) => (
            <AccordionItem
              key={question.question}
              value={question.question}
            >
              <AccordionTrigger
                iconSize={7}
                className={cn(
                  `outline-none ring-inset ring-secondary focus:ring-2 max-sm:rounded-none`,
                  index === 0 && `rounded-t-2xl`,
                  index === questions.length - 1 && `[&[data-state=closed]]:rounded-b-2xl`
                )}
              >
                <span
                  className={cn(
                    `flex w-full shrink-0 gap-2 p-4 pe-12 text-2xl text-[#64d8b4] hover:brightness-125 max-sm:flex-col sm:basis-1/3 sm:gap-4`
                  )}
                >
                  {question.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className={cn(`flex flex-col gap-2 px-4`)}>
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};

export default Faq;
