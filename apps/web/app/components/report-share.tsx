'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@scamshield/ui';

export function ReportShare({ reportId }: { reportId: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/report/${reportId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" onClick={share} className="flex items-center gap-2">
      <Share2 className="h-4 w-4" /> {copied ? 'Copied!' : 'Share report'}
    </Button>
  );
}
