import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-x-2.5 rounded-full bg-background px-2.5 py-1.5 text-xs border',
  {
    variants: {
      status: {
        success: '',
        error: '',
        default: '',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  leftLabel: string;
  rightLabel: React.ReactNode;
}

export function StatusBadge({
  className,
  status,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftLabel,
  rightLabel,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      <span className="text-foreground inline-flex items-center gap-1.5 font-medium">
        {LeftIcon && (
          <LeftIcon
            className={cn(
              '-ml-0.5 size-4 shrink-0',
              status === 'success' && 'text-emerald-600 dark:text-emerald-500',
              status === 'error' && 'text-red-600 dark:text-red-500'
            )}
            aria-hidden={true}
          />
        )}
        {leftLabel}
      </span>
      <span className="bg-border h-4 w-px" />
      <span className="text-muted-foreground inline-flex items-center gap-1.5">
        {RightIcon && <RightIcon className="-ml-0.5 size-4 shrink-0" aria-hidden={true} />}
        {rightLabel}
      </span>
    </span>
  );
}
