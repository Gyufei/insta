'use client';

import { useState } from 'react';
import BalanceSection from './balance-section';
import ActionButtons from './action-buttons';
import HelpButton from './help-button';
import TokenList from './token-list';
import SearchBar from './search-bar';

export default function BalanceDisplay() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div
      className="bg-background dark:bg-dark-500 flex h-full flex-col"
      style={{
        width: 'clamp(var(--min-width-app), var(--width-sidebar-context), 100%)',
      }}
    >
      <div className="scrollbar-hover flex-grow overflow-y-scroll">
        <div className="mx-auto h-full" style={{ maxWidth: '296px' }}>
          <div className="flex h-full flex-col py-2 sm:py-4">
            <BalanceSection balance="0.00" />
            <ActionButtons />
            <HelpButton />

            <div className="mt-2 flex flex-grow flex-col sm:mt-4">
              <div className="flex flex-shrink-0">
                <SearchBar
                  placeholder="Search Currency"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FilterButton />
              </div>

              <TokenList searchQuery={searchQuery} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterButton() {
  return (
    <div className="v-popover">
      <div className="trigger" style={{ display: 'inline-block' }}>
        <button
          className="focus:bg-ocean-blue-light cursor-pointer focus:text-ocean-blue-pure dark:focus:bg-dark-400 text-brand active:bg-grey-light hover:text-ocean-blue-pure/50 dark:hover:bg-dark-400/30 dark:text-light border-grey-light dark:bg-dark-400/10 flex flex-shrink-0 items-center justify-center rounded-sm border bg-white py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50 dark:active:bg-white"
          style={{ width: '40px', height: '40px' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="dark:opacity-90"
            style={{ height: '20px' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
