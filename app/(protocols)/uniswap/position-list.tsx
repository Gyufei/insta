'use client';

import { Plus, Search } from 'lucide-react';

import { useState } from 'react';

import { TitleH2 } from '@/components/title-h2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { WithLoading } from '@/components/with-loading';

import { useUniswapPosition } from '@/lib/data/use-uniswap-position';

import { EmptyState } from './empty-state';
import { PositionItem } from './position-item';

export function PositionsSection() {
  const { data: positions, isLoading } = useUniswapPosition();

  const [searchQuery, setSearchQuery] = useState('');
  const [hideClosedPositions, setHideClosedPositions] = useState(true);

  const filteredPositions = positions?.filter((position) => {
    if (hideClosedPositions && position.status !== 'POSITION_STATUS_IN_RANGE') {
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

  return (
    <div className="flex w-full flex-grow flex-col">
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
              className="flex flex-shrink-0 select-none items-center justify-center"
            >
              <div className="flex items-center justify-center">
                <Plus className="mr-2 h-3 w-3" />
                New Position
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-grow flex-col">
        {isLoading ? (
          <div className="flex flex-grow items-center justify-center">
            <WithLoading isLoading={true} />
          </div>
        ) : positions?.length === 0 || filteredPositions?.length === 0 ? (
          <div className="flex flex-grow items-center justify-center">
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
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredPositions?.map((position) => (
              <PositionItem key={position.v3Position.tokenId} position={position} />
            ))}
          </div>
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
