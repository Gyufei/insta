'use client';

import { useState } from 'react';

import { SideDrawerLayout } from '../common/side-drawer-layout';
import BalanceActionButtons from './balance-action-buttons';
import BalanceSection from './balance-section';
import HelpButton from './help-button';
import SearchBar from './search-bar';
import TokenList from './token-list';

export function Balance() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SideDrawerLayout>
      <BalanceSection />
      <BalanceActionButtons />
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
