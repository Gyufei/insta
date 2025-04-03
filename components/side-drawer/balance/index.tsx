'use client';

import { useState } from 'react';
import BalanceSection from './balance-section';
import ActionButtons from './action-buttons';
import HelpButton from './help-button';
import TokenList from './token-list';
import SearchBar from './search-bar';

export function Balance() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="scrollbar-hover flex-grow overflow-y-scroll">
      <div className="mx-auto h-full" style={{ maxWidth: '296px' }}>
        <div className="flex h-full flex-col py-2 sm:py-4">
          <BalanceSection />
          <ActionButtons />
          <HelpButton />

          <div className="mt-2 flex flex-grow flex-col sm:mt-4">
            <div className="flex flex-shrink-0">
              <SearchBar
                placeholder="Search Currency"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <TokenList searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
}
