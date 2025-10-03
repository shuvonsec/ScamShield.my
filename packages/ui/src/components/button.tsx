import * as React from 'react';
import { cn } from '../utils/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
};

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-safe text-slate-950 hover:bg-sky-400',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
  outline: 'border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800',
  ghost: 'text-slate-200 hover:bg-slate-800',
  destructive: 'bg-red-500 text-white hover:bg-red-600'
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-xs',
  lg: 'px-5 py-3 text-base'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? ('a' as any) : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-60',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
