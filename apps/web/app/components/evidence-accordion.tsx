'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@scamshield/ui';

export function EvidenceAccordion({ signals }: { signals: string[] }) {
  if (!signals.length) {
    return <p className="text-sm text-slate-300">No significant risk signals detected.</p>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {signals.map((signal, index) => (
        <AccordionItem key={signal} value={`signal-${index}`}>
          <AccordionTrigger>Signal {index + 1}</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-slate-200">{signal}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
