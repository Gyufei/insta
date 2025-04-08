'use client';

import { useState } from 'react';
import BalanceSection from './balance-section';
import ActionButtons from './action-buttons';
import HelpButton from './help-button';
import TokenList from './token-list';
import SearchBar from './search-bar';
import { SideDrawerLayout } from '../common/side-drawer-layout';

export function Balance() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SideDrawerLayout>
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
    </SideDrawerLayout>
  );
}
