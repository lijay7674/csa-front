import { type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
}

const badgeVariants: Record<string, string> = {
  default: 'bg-[var(--badge-bg)] text-[var(--badge-text)]',
  secondary: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
  outline: 'border border-[var(--border)] text-[var(--text-secondary)] bg-transparent',
  destructive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
