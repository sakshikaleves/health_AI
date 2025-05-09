// src/components/ui/accordion.jsx
"use client";

import * as React from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";        // shadcn’s class‑name helper; or just inline className strings

export const Accordion = ({ className, ...props }) => (
  <RadixAccordion.Root
    className={cn("flex flex-col gap-4", className)}
    {...props}
  />
);

export const AccordionItem = RadixAccordion.Item;

export const AccordionTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <RadixAccordion.Header>
      <RadixAccordion.Trigger
        ref={ref}
        className={cn(
          "w-full text-left flex items-center justify-between font-medium transition-colors",
          className
        )}
        {...props}
      >
        {children}
        <span className="transition-transform group-data-[state=open]:rotate-180">
          ▾
        </span>
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  )
);
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <RadixAccordion.Content
      ref={ref}
      className={cn(
        "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    />
  )
);
AccordionContent.displayName = "AccordionContent";
