import * as React from 'react';
import { cn } from '../utils/cn';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
};

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-safe/20 text-safe border border-safe/40',
  secondary: 'bg-slate-800 text-slate-200 border border-slate-700',
  outline: 'border border-slate-700 text-slate-200',
  destructive: 'bg-red-500/20 text-red-300 border border-red-400'
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold uppercase', variants[variant], className)}
      {...props}
    />
  );
}
