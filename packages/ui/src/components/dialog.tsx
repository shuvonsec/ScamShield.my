'use client';

import * as React from 'react';
import { cn } from '../utils/cn';

type DialogContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

type DialogProps = {
  children: React.ReactNode;
};

export function Dialog({ children }: DialogProps) {
  const [open, setOpen] = React.useState(false);
  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children, asChild = false }: { children: React.ReactNode; asChild?: boolean }) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error('DialogTrigger must be used within Dialog');
  const Comp: any = asChild ? React.Children.only(children) : 'button';
  const props = asChild
    ? {
        ...Comp.props,
        onClick: (event: React.MouseEvent) => {
          Comp.props.onClick?.(event);
          context.setOpen(true);
        }
      }
    : {
        className: 'rounded-md bg-safe px-4 py-2 text-sm font-medium text-slate-950',
        onClick: () => context.setOpen(true),
        children
      };
  return asChild ? React.cloneElement(Comp, props) : <button {...props} />;
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error('DialogContent must be used within Dialog');
  if (!context.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
      <div className={cn('w-full max-w-lg rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl', className)}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-slate-300', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-6 flex justify-end gap-2', className)} {...props} />;
}
