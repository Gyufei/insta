'use client';

import { Grid, LayoutDashboard, Medal, Search, X } from 'lucide-react';

import { useMemo, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { IMarket, useMarkets } from '../common/use-markets';
import SearchSuggestions from './SearchSuggestions';

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  icon: React.ReactNode;
}

const NavLink = ({ href, label, icon, isActive }: NavLinkProps) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      href={href}
      className={`flex font-medium items-center gap-1 px-[10px] h-8 rounded-[8px] text-sm ${
        isActive ? 'text-white bg-[#6E75F9]' : 'text-[#A5ADC6] bg-transparent hover:text-[#6E75F9]'
      }`}
    >
      <span
        className={cn(
          'text-[#A5ADC6]',
          isActive && 'text-white',
          !isActive && isHover && 'text-[#6E75F9]'
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

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
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    <input
      type="text"
      placeholder="Search Currency"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className={`w-full pl-10 ${searchQuery ? 'pr-10' : 'pr-4'} h-12 border border-[#EBEBEB] rounded-[8px] focus:outline-none`}
    />
    {searchQuery && (
      <button
        onClick={onClear}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
      >
        <X className="h-5 w-5" />
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
        <div className="flex-1 flex items-center gap-6 min-w-0">
          <div className="flex-1 min-w-[200px]">
            <SearchInput {...searchInputProps} />
          </div>

          <nav className="flex-none flex items-center gap-6">
            <NavLink
              href="/odds/markets"
              label="Markets"
              icon={<Grid className="h-4 w-4" />}
              isActive={pathname === '/odds' || pathname.startsWith('/odds/market')}
            />
            <NavLink
              href="/odds/dashboard"
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Dashboard"
              isActive={pathname.startsWith('/odds/dashboard')}
            />
            <NavLink
              icon={<Medal className="h-4 w-4" />}
              href="/odds/ranks"
              label="Ranks"
              isActive={pathname === '/odds/ranks'}
            />
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden">
        <div className="w-full px-4">
          <div className="flex flex-col py-4">
            <SearchInput {...searchInputProps} />
          </div>
        </div>
      </header>
    </>
  );
}
