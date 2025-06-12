'use client';

import { Grid, LayoutDashboard, Medal, Search, X } from 'lucide-react';

import { useMemo, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IMarket, useMarkets } from '../common/use-markets';
import SearchSuggestions from './SearchSuggestions';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavLink = ({ href, icon, label, isActive }: NavLinkProps) => (
  <Link
    href={href}
    className={`flex items-center gap-1 ${
      isActive
        ? 'text-[var(--color-nav-text-active)]'
        : 'text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)]'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  showSuggestions: boolean;
  isSearching: boolean;
  searchResults: {
    id: string;
    title: string;
    image: string;
    volume: string;
    outcomes?: { yes: string; no: string };
  }[];
  onNavigate: () => void;
  ref: ReturnType<typeof useOnclickOutside>;
}

const SearchInput = ({
  searchQuery,
  onSearchChange,
  onClear,
  showSuggestions,
  isSearching,
  searchResults,
  onNavigate,
  ref,
}: SearchInputProps) => (
  <div ref={ref} className="relative w-full z-10">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <input
      type="text"
      placeholder="Search markets"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className={`w-full pl-10 ${searchQuery ? 'pr-10' : 'pr-4'} py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-odd-main-ring)]`}
    />
    {searchQuery && (
      <button
        onClick={onClear}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </button>
    )}
    {showSuggestions && (
      <SearchSuggestions
        query={searchQuery}
        isLoading={isSearching}
        results={searchResults}
        onClose={onClear}
        onNavigate={onNavigate}
      />
    )}
  </div>
);

export default function OddsHeader() {
  const pathname = usePathname();
  const { data: marketData, isFetching: isSearching } = useMarkets('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useOnclickOutside(() => setShowSuggestions(false));

  const allMarkets = useMemo(() => marketData?.market_list ?? [], [marketData]);

  const searchResults = useMemo(() => {
    if (!searchQuery?.length) return [];

    return allMarkets
      .filter((market: IMarket) => market.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((market: IMarket) => ({
        id: market.market_id,
        title: market.title,
        image: market.image_url,
        volume: market.volume,
        outcomes:
          market.outcomes?.length === 2
            ? {
                yes: `${market.outcomes[0].probability}%`,
                no: `${market.outcomes[1].probability}%`,
              }
            : undefined,
      }));
  }, [allMarkets, searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(!!value.length);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const searchInputProps = {
    searchQuery,
    onSearchChange: handleSearchChange,
    onClear: clearSearch,
    showSuggestions,
    isSearching,
    searchResults,
    onNavigate: clearSearch,
    ref,
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block px-12">
        <div className="max-w-[1920px] mx-auto w-full px-4 border-b ">
          <div className="flex items-center h-16 gap-8">
            <div className="flex-1 flex items-center gap-8 min-w-0">
              <div className="flex-1 min-w-[200px]">
                <SearchInput {...searchInputProps} />
              </div>

              <nav className="flex-none flex items-center gap-6">
                <NavLink
                  href="/odds/markets"
                  icon={<Grid className="h-4 w-4" />}
                  label="Markets"
                  isActive={pathname === '/odds/markets' || pathname === '/odds'}
                />
                <NavLink
                  href="/odds/dashboard"
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  label="Dashboard"
                  isActive={pathname.startsWith('/odds/dashboard')}
                />
                <NavLink
                  href="/odds/ranks"
                  icon={<Medal className="h-4 w-4" />}
                  label="Ranks"
                  isActive={pathname === '/odds/ranks'}
                />
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden border-b">
        <div className="w-full px-4">
          <div className="flex flex-col py-4">
            <SearchInput {...searchInputProps} />
          </div>
        </div>
      </header>
    </>
  );
}
