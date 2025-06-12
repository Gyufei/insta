import { Ellipsis, Minus, Plus } from 'lucide-react';

import { useState } from 'react';

import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { IUniswapPosition } from '@/lib/data/use-uniswap-position';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { formatNumber } from '@/lib/utils/number';

import { TokenPairAndStatus } from './uni-common/token-pair-and-status';
import { usePositionDataFormat } from './uni-common/use-position-data-format';

interface PositionItemProps {
  position: IUniswapPosition;
}

export function PositionItem({ position }: PositionItemProps) {
  const { setCurrentComponent } = useSideDrawerStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    version,
    fee,
    token0: wrapToken0,
    token1: wrapToken1,
    token0Amount,
    token1Amount,
    price,
    mockPrice,
    isFullRange,
    minPrice,
    maxPrice,
    totalLiquidityUsd,
  } = usePositionDataFormat(position);

  const handleAddLiquidity = () => {
    setCurrentComponent({
      name: 'UniswapAddLiquidity',
      props: {
        uniswapPosition: position,
      },
    });
  };

  const handleRemoveLiquidity = () => {
    setCurrentComponent({
      name: 'UniswapRemoveLiquidity',
      props: {
        uniswapPosition: position,
      },
    });
  };

  return (
    <Card className="py-0 mt-2 relative border border-border hover:border-gray-200 gap-0 transition-colors">
      <TokenPairAndStatus
        token0={wrapToken0}
        token1={wrapToken1}
        status={position.status}
        version={version}
        fee={fee}
      />
      <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-black/80 rounded-b-xl">
        <div className="flex flex-col sm:flex-row gap-3 flex-grow mr-2">
          <div className="flex-1 basis-0">
            <span className="text-base font-semibold text-primary">
              {formatNumber(mockPrice || '-')}
              {formatNumber(price || '-')}
            </span>
            <span className="block text-sm text-gray-500 truncate">Current Price</span>
          </div>
          <div className="flex-1 basis-0 text-base font-semibold">
            <div className="flex items-center gap-1 text-primary">
              <span>{formatNumber(token0Amount)}</span>
              <LogoWithPlaceholder
                src={wrapToken0.logo}
                name={wrapToken0.symbol}
                width={16}
                className="rounded-full text-xs"
                height={16}
              />
              <span>/</span>
              <span>{formatNumber(token1Amount)}</span>
              <LogoWithPlaceholder
                src={wrapToken1.logo}
                name={wrapToken1.symbol}
                className="rounded-full text-xs"
                width={16}
                height={16}
              />
            </div>
            <span className="block text-sm text-gray-500 truncate">Amount</span>
          </div>
          <div className="flex-1 basis-0">
            <span className="text-base font-semibold text-primary">
              ${formatNumber(totalLiquidityUsd)}
            </span>
            <span className="block text-sm text-gray-500 truncate">Value</span>
          </div>
        </div>

        <div>
          {isFullRange ? (
            <span className="text-sm text-gray-500 truncate">Full range</span>
          ) : (
            <div className="flex flex-col gap-1">
              <div>
                <span className="text-gray-500">Min: </span>
                <span>
                  {formatNumber(minPrice || '-')} {wrapToken1.symbol} / {wrapToken0.symbol}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Max: </span>
                <span>
                  {formatNumber(maxPrice || '-')} {wrapToken1.symbol} / {wrapToken0.symbol}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions menu */}
        <div className="absolute top-4 right-4">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="border-border border h-8 w-8">
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={handleAddLiquidity}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add liquidity</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleRemoveLiquidity}>
                <Minus className="mr-2 h-4 w-4" />
                <span>Remove liquidity</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
