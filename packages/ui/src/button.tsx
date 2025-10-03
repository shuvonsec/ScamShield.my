import { Slot } from '@radix-ui/react-slot';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from './cn';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'secondary';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  asChild?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  default: 'bg-blue-600 text-white hover:bg-blue-500',
  outline: 'border border-slate-700 text-slate-100 hover:bg-slate-900',
  ghost: 'text-slate-200 hover:bg-slate-900',
  secondary: 'bg-slate-700 text-white hover:bg-slate-600'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref as never}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
