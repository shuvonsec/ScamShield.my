'use client';

import * as React from 'react';
import { cn } from '../utils/cn';

type SelectContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
};

export function Select({ value, onValueChange, children }: SelectProps) {
  const setValue = React.useCallback((next: string) => onValueChange(next), [onValueChange]);
  return <SelectContext.Provider value={{ value, setValue }}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, id, children }: { className?: string; id?: string; children: React.ReactNode }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');
  return (
    <button
      id={id}
      type="button"
      className={cn(
        'flex w-full items-center justify-between rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100',
        className
      )}
    >
      {context.value ? children : children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');
  return <span>{context.value || placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 space-y-1 rounded-md border border-slate-800 bg-slate-900 p-2">{children}</div>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');
  const active = context.value === value;
  return (
    <button
      type="button"
      onClick={() => context.setValue(value)}
      className={cn(
        'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
        active ? 'bg-safe text-slate-950' : 'text-slate-200 hover:bg-slate-800'
      )}
    >
      {children}
    </button>
  );
}
