import { ArchiveX } from 'lucide-react';

import React from 'react';

import { cn } from '@/lib/utils';

interface EmptyProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function Empty({ icon, title = 'No data', description = '', className }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="mb-4 text-gray-400">{icon || <ArchiveX className="h-12 w-12" />}</div>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}
