'use client';

import type React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <div className="relative mr-2 flex w-full items-center">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-10 w-full pl-9"
      />
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
