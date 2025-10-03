'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface EvidenceAccordionProps {
  signals: { type: string; label: string }[];
}

export function EvidenceAccordion({ signals }: EvidenceAccordionProps) {
  if (!signals.length) {
    return (
      <div className="rounded-md border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
        No suspicious signals detected. Stay vigilant and verify the sender.
      </div>
    );
  }

  return (
    <Accordion.Root type="multiple" className="w-full">
      <Accordion.Item value="signals" className="overflow-hidden rounded-md border border-slate-800">
        <Accordion.Header className="flex">
          <Accordion.Trigger className="flex flex-1 items-center justify-between bg-slate-900 px-4 py-3 text-left text-sm font-medium text-slate-100">
            Evidence signals
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="border-t border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200">
          <ul className="space-y-2">
            {signals.map((signal) => (
              <li key={signal.label} className="rounded bg-slate-900/80 p-2">
                <strong className="mr-2 uppercase text-slate-400">{signal.type}</strong>
                {signal.label}
              </li>
            ))}
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
