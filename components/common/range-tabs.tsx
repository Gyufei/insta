"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type RangeValue = '14D' | '30D' | 'ALL';

interface RangeTabsProps {
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
}

export function RangeTabs({
  value,
  onChange,
  className,
  listClassName,
  triggerClassName,
}: RangeTabsProps) {
  return (
    <Tabs
      className={className}
      value={value}
      onValueChange={(v) => onChange(v as RangeValue)}
    >
      <TabsList className={cn('bg-[#FAFAFA]', listClassName)}>
        <TabsTrigger
          className={cn(
            'text-xs data-[state=active]:text-white data-[state=active]:bg-[#6E75F9]',
            triggerClassName
          )}
          value="14D"
        >
          14D
        </TabsTrigger>
        <TabsTrigger
          className={cn(
            'text-xs data-[state=active]:text-white data-[state=active]:bg-[#6E75F9]',
            triggerClassName
          )}
          value="30D"
        >
          30D
        </TabsTrigger>
        <TabsTrigger
          className={cn(
            'text-xs data-[state=active]:text-white data-[state=active]:bg-[#6E75F9]',
            triggerClassName
          )}
          value="ALL"
        >
          All
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default RangeTabs;


