'use client';

import type React from 'react';

import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <div className="relative mr-2 flex w-full items-center">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-10 w-full pr-2 pl-9 leading-none rounded-sm border-light bg-white"
      />
      <Search className="search-icon absolute h-4 w-4" style={{ left: '12px' }} />
    </div>
  );
}
