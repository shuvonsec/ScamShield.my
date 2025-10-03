'use client';

import * as React from 'react';
import { cn } from '../utils/cn';

type AccordionContextValue = {
  openItem: string | null;
  setOpenItem: (value: string | null) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

type AccordionProps = {
  children: React.ReactNode;
  type?: 'single';
  collapsible?: boolean;
  className?: string;
};

export function Accordion({ children, className }: AccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);
  return (
    <div className={cn('space-y-2', className)}>
      <AccordionContext.Provider value={{ openItem, setOpenItem }}>{children}</AccordionContext.Provider>
    </div>
  );
}

export function AccordionItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <div data-value={value} className="overflow-hidden rounded-md border border-slate-800">{children}</div>;
}

export function AccordionTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');
  const open = context.openItem === value;
  return (
    <button
      type="button"
      onClick={() => context.setOpenItem(open ? null : value)}
      className="flex w-full items-center justify-between bg-slate-900 px-4 py-3 text-left text-sm font-medium text-slate-200"
    >
      <span>{children}</span>
      <span>{open ? '−' : '+'}</span>
    </button>
  );
}

export function AccordionContent({ value, children }: { value: string; children: React.ReactNode }) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');
  const open = context.openItem === value;
  return open ? <div className="bg-slate-950 px-4 py-3 text-sm text-slate-300">{children}</div> : null;
}
