import { Ellipsis, Minus, Plus } from 'lucide-react';
import { divide } from 'safebase';

import { useMemo, useState } from 'react';

import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { IToken } from '@/lib/data/tokens';
import { IUniswapPosition, PositionStatus } from '@/lib/data/use-uniswap-position';
import { cn } from '@/lib/utils';
import { formatBig, formatNumber } from '@/lib/utils/number';

import { TokenPairLogo } from './token-pair-logo';
import { useUniswapToken } from './use-uniswap-token';

interface PositionItemProps {
  position: IUniswapPosition;
}

const TICK_BASE = 1.0001;
const TICK_LOWER_MIN = -887272;
const TICK_UPPER_MAX = 887272;
const Q96 = BigInt('79228162514264337593543950336');

function getToken(token: Omit<IToken, 'logo'>, tokens: IToken[]): IToken {
  const t = tokens.find((t) => t.address === token.address);
  if (!t) {
    return {
      ...token,
      logo: '',
    };
  }

  return t;
}

function sqrtPriceX96ToPrice(sqrtPriceX96: string) {
  const sqrtPrice = Number((BigInt(sqrtPriceX96) * BigInt(1_000_000)) / Q96) / 1_000_000;
  return sqrtPrice ** 2;
}

const PositionStatusMap = {
  [PositionStatus.POSITION_STATUS_IN_RANGE]: 'In range',
  [PositionStatus.POSITION_STATUS_OUT_OF_RANGE]: 'Out of range',
  [PositionStatus.POSITION_STATUS_CLOSED]: 'Closed',
};

export function PositionItem({ position }: PositionItemProps) {
  const { v3Position, protocolVersion } = position;
  const {
    token0,
    token1,
    amount0,
    amount1,
    feeTier,
    tickLower,
    tickUpper,
    currentPrice,
    currentLiquidity,
    liquidity,
    totalLiquidityUsd,
  } = v3Position;

  const { tokens } = useUniswapToken();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const wrapToken0 = useMemo(() => getToken(token0, tokens), [tokens, token0]);
  const wrapToken1 = useMemo(() => getToken(token1, tokens), [tokens, token1]);

  const version = useMemo(() => {
    return protocolVersion.split('_').reverse()[0];
  }, [protocolVersion]);

  const fee = useMemo(() => {
    const feePercent = divide(feeTier, String(10000));
    return `${feePercent}%`;
  }, [feeTier]);

  const status = useMemo(() => {
    return PositionStatusMap[position.status];
  }, [position.status]);

  const token0Amount = useMemo(() => {
    const amount = divide(amount0, String(10 ** wrapToken0.decimals));
    if (Number(amount) < 10e-5) {
      return '<0.00001';
    }

    return amount;
  }, [amount0, wrapToken0.decimals]);

  const token1Amount = useMemo(() => {
    const amount = divide(amount1, String(10 ** wrapToken1.decimals));
    if (Number(amount) < 10e-5) {
      return '<0.00001';
    }

    return amount;
  }, [amount1, wrapToken1.decimals]);

  const price = useMemo(() => {
    return sqrtPriceX96ToPrice(currentPrice);
  }, [currentPrice]);

  const isFullRange = useMemo(() => {
    if (tickLower === TICK_LOWER_MIN.toString() && tickUpper === TICK_UPPER_MAX.toString()) {
      return true;
    }

    return false;
  }, [tickLower, tickUpper]);

  const minPrice = useMemo(() => {
    if (isFullRange) {
      return '0';
    }

    return Math.pow(TICK_BASE, Number(tickLower));
  }, [tickLower, isFullRange]);

  const maxPrice = useMemo(() => {
    if (isFullRange) {
      return '∞';
    }

    return Math.pow(TICK_BASE, Number(tickUpper));
  }, [tickUpper, isFullRange]);

  const currentLiq = useMemo(() => {
    return formatBig(currentLiquidity);
  }, [currentLiquidity]);

  const totalLiq = useMemo(() => {
    return formatBig(liquidity);
  }, [liquidity]);

  return (
    <Card className="py-0 relative border border-border hover:border-gray-200 gap-0 transition-colors">
      <div className="p-4 flex items-start gap-4 w-full md:w-auto">
        <TokenPairLogo token0={wrapToken0} token1={wrapToken1} />

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">
              {wrapToken0.symbol} / {wrapToken1.symbol}
            </span>
            <div className="flex bg-gray-200 text-xs rounded-md items-center justify-between text-gray-400">
              <span className="px-2 border-r border-white">{version}</span>
              <span className="px-2">{fee}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  'w-2 h-2 rounded-full opacity-60',
                  status === 'In range' && 'bg-green-600',
                  status === 'Out of range' && 'bg-red-600',
                  status === 'Closed' && 'bg-gray-600'
                )}
              ></div>
              <span
                className={cn(
                  'text-xs',
                  status === 'In range' && 'text-green-600',
                  status === 'Out of range' && 'text-red-600',
                  status === 'Closed' && 'text-gray-600'
                )}
              >
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-black/80 rounded-b-xl">
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
          <div className="flex-1 basis-0">
            <span className="text-base font-semibold text-primary">{formatNumber(price || '-')}</span>
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
              {formatNumber(currentLiq)} / {formatNumber(totalLiq)}( $
              {formatNumber(totalLiquidityUsd)})
            </span>
            <span className="block text-sm text-gray-500 truncate">Current/Total Liquidity</span>
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
              <DropdownMenuItem className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                <span>Add liquidity</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
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
