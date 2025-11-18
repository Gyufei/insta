import { Ellipsis, Minus, Plus } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { formatNumber, toNonExponential } from '@/lib/utils/number';

export interface PositionItemBaseProps {
  header: React.ReactNode;
  positionAmount: number | string;
  displayPrice: number | string;
  totalLiquidityUsd: number | string;
  range: {
    isFullRange: boolean;
    minPrice?: number | string;
    maxPrice?: number | string;
    token0Symbol?: string;
    token1Symbol?: string;
  };
  onAddLiquidity: () => void;
  onRemoveLiquidity: () => void;
}

function formatPrice(price: number | string) {
  if (Number(price) > 0.01 && Number(price) < 10 ** 5) {
    return formatNumber(price);
  } else if (Number(price) > 10 ** 5) {
    const p = toNonExponential(price);
    return p.replace(/0{3,}/g, (match) => `0(${match.length})`);
  } else if (Number(price) < 10 ** -12) {
    return '<0.000000000001';
  } else {
    const p = toNonExponential(price);
    return p.length > 10 ? p.slice(0, 12) : p;
  }
}

export function PositionItemBase(props: PositionItemBaseProps) {
  const { header, displayPrice, totalLiquidityUsd, range, onAddLiquidity, onRemoveLiquidity } =
    props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Card className="py-0 relative border border-[#ebebeb] hover:border-gray-200 gap-0 transition-colors">
      {header}
      <div className="flex md:flex-row flex-col gap-3 md:gap-0 justify-between md:items-center items-stretch mx-4 py-4 border-t border-[#ebebeb]">
        {/* 桌面端：保持原三列布局不变 */}
        <div className="hidden md:flex flex-row md:flex-nowrap flex-wrap md:justify-start justify-between gap-3 flex-grow mr-2">
          <div className="flex-1 basis-0">
            <span className="text-base font-medium text-primary">
              ${formatNumber(totalLiquidityUsd)}
            </span>
            <span className="block text-sm text-[#A5ADC6] truncate">Position</span>
          </div>
          <div className="flex-1 basis-0">
            <span className="text-base font-medium text-primary">
              {formatPrice(displayPrice) || '-'}
            </span>
            <span className="block text-sm text-[#A5ADC6] truncate">Current Price</span>
          </div>
          <div className="flex-1 basis-0 flex flex-col items-end sm:items-start">
            <span className="text-base font-medium text-primary">
              ${formatNumber(totalLiquidityUsd)}
            </span>
            <span className="block text-sm text-[#A5ADC6] truncate">Value</span>
          </div>
        </div>

        {/* 移动端：按图片 UI，每项一行，标题在左，数值在右 */}
        <div className="flex md:hidden flex-col gap-2 flex-grow mr-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#A5ADC6]">Position</span>
            <span className="text-base font-medium text-primary">
              ${formatNumber(totalLiquidityUsd)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#A5ADC6]">Current Price</span>
            <span className="text-base font-medium text-primary">
              {formatPrice(displayPrice) || '-'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#A5ADC6]">Value</span>
            <span className="text-base font-medium text-primary">
              ${formatNumber(totalLiquidityUsd)}
            </span>
          </div>
        </div>

        {/* 桌面端区间展示：保持原样 */}
        <div className="hidden md:block">
          {range.isFullRange ? (
            <span className="text-sm text-[#A5ADC6] truncate">Full range</span>
          ) : (
            <div className="flex flex-col gap-1">
              <div>
                <span className="text-[#A5ADC6]">Min: </span>
                <span>
                  {formatPrice(range.minPrice || '-')} {range.token1Symbol} / {range.token0Symbol}
                </span>
              </div>
              <div>
                <span className="text-[#A5ADC6]">Max: </span>
                <span className="max-w-[140px] truncate">
                  {formatPrice(range.maxPrice || '-')} {range.token1Symbol} / {range.token0Symbol}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 移动端区间展示：每项一行，标题左值右 */}
        <div className="md:hidden flex flex-col gap-2">
          {range.isFullRange ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A5ADC6]">Range</span>
              <span className="text-sm text-[#A5ADC6]">Full range</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A5ADC6]">Min</span>
                <span className="text-base text-primary">
                  {formatPrice(range.minPrice || '-')} {range.token1Symbol} / {range.token0Symbol}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A5ADC6]">Max</span>
                <span className="text-base text-primary">
                  {formatPrice(range.maxPrice || '-')} {range.token1Symbol} / {range.token0Symbol}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="absolute top-4 right-4">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="border-[#ebebeb] border h-8 w-8">
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={onAddLiquidity}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add liquidity</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={onRemoveLiquidity}>
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
