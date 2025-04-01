'use client';

import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  tooltipText?: string;
}

export default function StatCard({ value, label, icon, className, tooltipText }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col items-center justify-center space-y-1 p-4', className)}>
      {icon && (
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full">{icon}</div>
      )}
      <div className="stat-value">{value}</div>
      <div className="stat-label flex items-center">
        {label}
        {tooltipText && (
          <span className="text-muted-foreground ml-1 inline-flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </span>
        )}
      </div>
    </Card>
  );
}
