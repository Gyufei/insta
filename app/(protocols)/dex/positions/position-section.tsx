'use client';

import { Plus, Search } from 'lucide-react';

import { useState } from 'react';

import { IToken } from '@/config/tokens';

import type { DexProjectId } from '../dex-config';

import { PositionsEmpty } from './common/positions-empty';
import { TitleH2 } from '@/components/common/title-h2';
import { WithLoading } from '@/components/common/with-loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { PositionStatus, useUniswapPosition } from '@/lib/data/use-uniswap-position';
import { useAmbientPosition } from '@/lib/data/use-ambient-position';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { isSameAddress } from '@/lib/utils';

import { PositionItem } from './position-item';
import { TOKENS } from './use-token';

function getToken(token: Omit<IToken, 'logo'>, tokens: IToken[]): IToken {
  const t = tokens.find((t) => isSameAddress(t.address, token.address));
  if (!t) {
    return {
      ...token,
      logo: '',
    };
  }

  return t;
}

export function PositionsSection({ selectedProject }: { selectedProject: DexProjectId }) {
  const { setCurrentComponent } = useSideDrawerStore();
  const { data: positions, isLoading: isUniswapLoading } = useUniswapPosition();
  const { data: ambientData, isLoading: isAmbientLoading } = useAmbientPosition();

  const [searchQuery, setSearchQuery] = useState('');

  const withFilter = Boolean(searchQuery);
  const isUniswapSelected = selectedProject === 'uniswap' || selectedProject === 'auto-routing';

  const tokens = TOKENS;
  const filteredPositions = positions?.filter((position) => {
    if (position.status === PositionStatus.POSITION_STATUS_CLOSED) {
      return false;
    }

    if (searchQuery) {
      const { token0, token1 } = position.v3Position;
      const wrapToken0 = getToken(token0, tokens) || token0;
      const wrapToken1 = getToken(token1, tokens) || token1;
      const searchLower = searchQuery.toLowerCase();
      return (
        token0.symbol.toLowerCase().includes(searchLower) ||
        token1.symbol.toLowerCase().includes(searchLower) ||
        wrapToken0.symbol.toLowerCase().includes(searchLower) ||
        wrapToken1.symbol.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const ambientPositions = ambientData?.positions;
  const filteredAmbientPositions = ambientPositions?.filter((position) => {
    if (searchQuery) {
      const token0 = tokens.find((t) => isSameAddress(t.address, position.base));
      const token1 = tokens.find((t) => isSameAddress(t.address, position.quote));
      const searchLower = searchQuery.toLowerCase();
      return (
        token0?.symbol.toLowerCase().includes(searchLower) ||
        token1?.symbol.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  function handleNewPosition() {
    // Auto Routing follows Uniswap behavior
    if (selectedProject === 'uniswap' || selectedProject === 'auto-routing') {
      setCurrentComponent({ name: 'UniswapCreatePosition' });
      return;
    }

    if (selectedProject === 'ambient') {
      setCurrentComponent({ name: 'AmbientCreatePosition' });
      return;
    }
  }

  return (
    <div className="flex w-full flex-grow flex-col px-4 2xl:px-12 mt-[50px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <TitleH2>My Positions</TitleH2>
        <div className="mt-3 md:mt-4 flex items-center sm:mt-0">
          <div className="w-full sm:w-40">
            <div className="relative flex w-full items-center">
              <Input
                type="text"
                placeholder="Search position"
                className="form-input w-full pr-2 leading-none pl-9 py-1 h-8 shadow-none outline-none focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="search-icon absolute h-4 w-4" style={{ left: '12px' }} />
            </div>
          </div>
          <div className="ml-3">
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

      <div className="mt-4 flex flex-grow flex-col gap-4 min-h-50">
        {(isUniswapSelected ? isUniswapLoading : isAmbientLoading) ? (
          <div className="py-20 rounded-sm bg-muted/80 flex items-center justify-center">
            <WithLoading isLoading={true} />
          </div>
        ) : isUniswapSelected ? (
          !positions?.length || (withFilter && !filteredPositions?.length) ? (
            <PositionsEmpty
              isEmpty={(positions?.length || 0) === 0}
              hasFilterApplied={withFilter}
            />
          ) : (
            <>
              {filteredPositions?.map((position) => (
                <PositionItem key={position.v3Position.tokenId} protocol="uniswap" position={position} />
              ))}
            </>
          )
        ) : !ambientPositions?.length || (searchQuery && !filteredAmbientPositions?.length) ? (
          <PositionsEmpty
            isEmpty={(ambientPositions?.length || 0) === 0}
            hasFilterApplied={Boolean(searchQuery)}
          />
        ) : (
          <>
            {filteredAmbientPositions?.map((position) => (
              <PositionItem key={position.positionId} protocol="ambient" position={position} />
            ))}
          </>
        )}
      </div>

    </div>
  );
}
