import { cn } from '@scamshield/ui/cn';

const verdictMap = {
  safe: 'bg-green-500/20 text-green-300 border border-green-500/40',
  unknown: 'bg-slate-500/20 text-slate-300 border border-slate-500/40',
  suspicious: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
  malicious: 'bg-red-500/20 text-red-300 border border-red-500/40'
};

export function VerdictBadge({
  verdict,
  score
}: {
  verdict: 'safe' | 'unknown' | 'suspicious' | 'malicious';
  score: number;
}) {
  return (
    <span className={cn('rounded-full px-3 py-1 text-sm font-semibold', verdictMap[verdict])}>
      {verdict.toUpperCase()} · {score}
    </span>
  );
}
