import { HardDrive } from 'lucide-react';

import type { ReactNode } from 'react';

interface EmptyStateProps {
  message: ReactNode;
  className?: string;
}

export function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center self-center rounded-sm bg-muted/80 py-20 text-center text-base leading-normal text-muted-foreground ${className}`}
    >
      <HardDrive className="mb-2 w-12" />
      <div>{message}</div>
    </div>
  );
}
