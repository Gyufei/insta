'use client';

import { Plus, Search } from 'lucide-react';

import { useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { TitleH2 } from '@/components/common/title-h2';
import { WithLoading } from '@/components/common/with-loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useAmbientPosition } from '@/lib/data/use-ambient-position';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { useUniswapToken } from '../uniswap/use-uniswap-token';
import { PositionItem } from './ambient-position-item';

export function AmbientPositionsSection() {
  const { setCurrentComponent } = useSideDrawerStore();
  const { data: positionData, isLoading } = useAmbientPosition();
  const positions = positionData?.positions;

  const [searchQuery, setSearchQuery] = useState('');

  const { tokens } = useUniswapToken();

  const filteredPositions = positions?.filter((position) => {
    if (searchQuery) {
      const token0 = tokens.find((token) => token.address === position.base);
      const token1 = tokens.find((token) => token.address === position.quote);

      const searchLower = searchQuery.toLowerCase();
      return (
        token0?.symbol.toLowerCase().includes(searchLower) ||
        token1?.symbol.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  function handleNewPosition() {
    setCurrentComponent({ name: 'AmbientCreatePosition' });
  }

  return (
    <div className="flex w-full flex-grow flex-col px-4 2xl:px-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <TitleH2>Your Positions</TitleH2>
        <div className="mt-4 flex items-center sm:mt-0">
          <div className="w-full sm:w-40">
            <div className="relative flex w-full items-center">
              <Input
                type="text"
                placeholder="Search position"
                className="form-input w-full pr-2 leading-none pl-9 py-1 h-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="search-icon absolute h-4 w-4" style={{ left: '12px' }} />
            </div>
          </div>
          <div className="ml-2">
            <Button
              size="sm"
              className="flex bg-pro-blue text-white hover:bg-pro-blue/80 flex-shrink-0 select-none items-center justify-center"
              onClick={handleNewPosition}
            >
              <div className="flex items-center justify-center">
                <Plus className="mr-2 h-3 w-3" />
                New Position
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-grow flex-col min-h-50">
        {isLoading ? (
          <div className="py-20 rounded-sm bg-muted/80 flex items-center justify-center">
            <WithLoading isLoading={true} />
          </div>
        ) : !positions?.length || !filteredPositions?.length ? (
          <EmptyState
            message={
              positions?.length === 0 ? (
                <>
                  You have no active positions. <br />
                  Create a position to get started!
                </>
              ) : (
                <>
                  No positions found. <br />
                </>
              )
            }
          />
        ) : (
          <>
            {filteredPositions?.map((position) => (
              <PositionItem key={position.positionId} position={position} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
