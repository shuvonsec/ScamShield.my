import { cn } from '@scamshield/ui';

type Verdict = 'safe' | 'unknown' | 'suspicious' | 'malicious';

const colors: Record<Verdict, string> = {
  safe: 'bg-green-500/20 text-green-200 border-green-400/40',
  unknown: 'bg-slate-500/20 text-slate-200 border-slate-400/40',
  suspicious: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
  malicious: 'bg-red-500/20 text-red-200 border-red-400/40'
};

export function VerdictPill({ verdict, score }: { verdict: Verdict; score: number }) {
  return (
    <span className={cn('rounded-full border px-3 py-1 text-sm font-semibold', colors[verdict])}>
      {verdict.toUpperCase()} · {score}
    </span>
  );
}
