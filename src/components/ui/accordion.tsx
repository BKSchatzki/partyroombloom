'use client';

import * as React from 'react';

import { ChevronDown } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const accordionIconSizeClasses = {
  4: 'size-4',
  6: 'size-6',
  7: 'size-7',
} as const;

type AccordionIconSize = keyof typeof accordionIconSizeClasses;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b-0', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    iconSize?: AccordionIconSize;
  }
>(({ className, children, iconSize = 4, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex justify-center">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'relative w-full text-start transition-all [&[data-state=open]>svg]:rotate-180',
        // 'flex flex-1 items-center justify-between hover:underline font-medium '
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'absolute top-4 right-4 transition-transform duration-200',
          accordionIconSizeClasses[iconSize]
          // `h-4 w-4 shrink-0`
        )}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all"
    {...props}
  >
    <div className={cn('pt-0 pb-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
