'use client';

import { Plus, Search } from 'lucide-react';

import { useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { TitleH2 } from '@/components/common/title-h2';
import { WithLoading } from '@/components/common/with-loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import { PositionStatus, useUniswapPosition } from '@/lib/data/use-uniswap-position';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { PositionItem } from './uniswap-position-item';

export function UniswapPositionsSection() {
  const { setCurrentComponent } = useSideDrawerStore();
  const { data: positions, isLoading } = useUniswapPosition();

  const [searchQuery, setSearchQuery] = useState('');
  const [hideClosedPositions, setHideClosedPositions] = useState(true);

  const filteredPositions = positions?.filter((position) => {
    if (hideClosedPositions && position.status === PositionStatus.POSITION_STATUS_CLOSED) {
      return false;
    }

    if (searchQuery) {
      const { token0, token1 } = position.v3Position;
      const searchLower = searchQuery.toLowerCase();
      return (
        token0.symbol.toLowerCase().includes(searchLower) ||
        token1.symbol.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  function handleNewPosition() {
    setCurrentComponent({ name: 'UniswapCreatePosition' });
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
              <PositionItem key={position.v3Position.tokenId} position={position} />
            ))}
          </>
        )}
      </div>

      <div className="mt-2 flex w-full items-center text-muted-foreground">
        <div className="flex w-full items-center justify-end">
          <div className="mr-4 cursor-pointer">Hide closed positions</div>
          <Switch checked={hideClosedPositions} onCheckedChange={setHideClosedPositions} />
        </div>
      </div>
    </div>
  );
}
