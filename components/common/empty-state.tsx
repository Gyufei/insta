import { CircleHelp } from 'lucide-react';

import type { ReactNode } from 'react';

interface EmptyStateProps {
  message: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function EmptyState({ message, description, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex w-full flex-col border border-border items-center justify-center self-center rounded-sm bg-popover py-10 text-center text-base leading-normal text-muted-foreground ${className}`}
    >
      <div className="bg-primary-foreground rounded-xl flex items-center justify-center w-15 h-15 border border-border">
        <CircleHelp className="w-8 h-8 text-muted-foreground/60" />
      </div>
      <div className="mt-4 text-primary font-medium">{message}</div>
      {description && (
        <div className="mt-[6px] text-sm text-pro-gray font-normal">{description}</div>
      )}
    </div>
  );
}
