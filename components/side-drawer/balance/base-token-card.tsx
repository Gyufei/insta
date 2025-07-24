import { multiply } from 'safebase';

import Image from 'next/image';

import { IToken } from '@/config/tokens';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils/number';

interface BaseTokenCardProps {
  token: IToken;
  balance: string;
  price: string;
  chain: string;
  showTrade?: boolean;
  className?: string;
}

export function BaseTokenCard({
  token,
  balance,
  price,
  showTrade = true,
  chain,
  className,
}: BaseTokenCardProps) {
  const { setCurrentComponent } = useSideDrawerStore();

  const priceValue = multiply(balance, String(price || 0));

  function handleTrade() {
    setCurrentComponent({ name: 'UniswapSwap', props: { token } });
  }

  return (
    <Card className={cn('p-4 shadow-none bg-white rounded-md border-none', className)}>
      <CardContent className="flex justify-between items-center px-0">
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center dark:opacity-90">
            <div className="flex relative max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full">
              {token.logo ? (
                <Image
                  width={40}
                  height={40}
                  src={token.logo || '/placeholder.svg'}
                  className="h-10 w-10 flex-grow object-contain"
                  alt={token.name}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center truncate rounded-full bg-gradient-to-br from-gray-300 to-gray-900 text-sm leading-none text-primary uppercase">
                  {token.symbol.toLowerCase()}
                </div>
              )}
              <div className="absolute top-0 bg-white -right-[2px] rounded-full">
                <Image width={16} height={16} src={`/icons/${chain}.svg`} alt={chain} />
              </div>
            </div>
          </div>

          <div className="flex flex-col px-3">
            <div className="text-primary mb-1 flex items-center text-sm font-semibold whitespace-nowrap">
              {formatNumber(balance)} {token.symbol}
            </div>
            <div className="text-xs font-medium whitespace-nowrap text-gray-300">
              ${formatNumber(priceValue)}
            </div>
          </div>
        </div>

        {showTrade && (
          <Button
            onClick={handleTrade}
            variant="outline"
            size="sm"
            className="hover:border-pro-blue/20 cursor-pointer hover:bg-pro-blue/20 hover:text-pro-blue text-xs px-3 h-6"
          >
            Trade
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
