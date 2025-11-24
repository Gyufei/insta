import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TAB_ENABLED } from '@/config/feature-flags';
import { IToken } from '@/config/tokens';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { eventBus } from '@/lib/state/eventBus';
// import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils/number';

interface BaseTokenCardProps {
  token: IToken;
  balance: string;
  chain: string;
  showTrade?: boolean;
  className?: string;
  onClaim?: (_t: IToken) => void;
}

export function BaseTokenCard({
  token,
  balance,
  showTrade = true,
  chain,
  className,
  onClaim,
}: BaseTokenCardProps) {
  const router = useRouter();

  function handleTrade() {
    eventBus.publish('trade-token', { name: 'TradeToken', props: { token } });

    sessionStorage.setItem('token', JSON.stringify(token));
    // Navigate based on feature flag: DEX or legacy Trade module
    router.push(TAB_ENABLED.dex ? `/dex` : `/trade`);
  }

  function handleClaim() {
    onClaim?.(token);
  }

  return (
    <Card className={cn('p-4 shadow-none bg-white rounded-md border-none', className)}>
      <CardContent className="flex justify-between items-center px-0">
        <div className="flex items-center w-full">
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

          <div className="flex justify-between pl-3 w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between">
                <div className="text-primary mb-1 flex items-center text-sm font-semibold whitespace-nowrap">
                  {formatNumber(balance)} {token.symbol}
                </div>

                {!onClaim && showTrade && (
                  <Button
                    onClick={handleTrade}
                    variant="outline"
                    size="sm"
                    className="h-5 hover:border-pro-blue/20 cursor-pointer hover:bg-pro-blue/20 hover:text-pro-blue text-xs px-[10px]"
                  >
                    Trade
                  </Button>
                )}
              </div>
              <div className="text-xs font-medium mt-1 whitespace-nowrap text-gray-300">
                {token.description}
              </div>
            </div>
            {!!onClaim && (
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={handleClaim}
                  variant="outline"
                  size="sm"
                  className="h-5 w-12 hover:border-pro-blue/20 cursor-pointer hover:bg-pro-blue/20 hover:text-pro-blue text-xs px-[10px]"
                >
                  Claim
                </Button>
                {showTrade && (
                  <Button
                    onClick={handleTrade}
                    variant="outline"
                    size="sm"
                    className="h-5 hover:border-pro-blue/20 cursor-pointer hover:bg-pro-blue/20 hover:text-pro-blue text-xs px-[10px]"
                  >
                    Trade
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
