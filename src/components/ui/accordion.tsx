'use client';

import * as React from 'react';

import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

const Accordion = AccordionPrimitive.Root;

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
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger, 'iconSize'>
>(({ className, children, iconSize, ...props }, ref) => (
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
          `absolute right-4 top-4 size-${iconSize} transition-transform duration-200`
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
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
