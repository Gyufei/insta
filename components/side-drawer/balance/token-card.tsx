import { TokenPriceMap } from '@/lib/data/tokens';
import { formatNumber } from '@/lib/utils/number';
import { useAccountBalance } from '@/lib/web3/use-account-balance';
import Image from 'next/image';
import { multiply } from 'safebase';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TokenCardProps {
  name: string;
  symbol: string;
  iconUrl: string;
  className?: string;
}

export default function TokenCard({ name, symbol, iconUrl, className }: TokenCardProps) {
  const { balance } = useAccountBalance();
  const priceValue = multiply(balance, String(TokenPriceMap[symbol] || 0));

  return (
    <Card className={cn(className)}>
      <CardContent className="flex items-center">
        <div className="flex h-10 w-10 items-center justify-center dark:opacity-90">
          <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full">
            {iconUrl ? (
              <Image
                width={40}
                height={40}
                src={iconUrl || '/placeholder.svg'}
                className="h-10 w-10 flex-grow object-contain"
                alt={name}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center truncate rounded-full bg-gradient-to-br from-gray-300 to-gray-900 text-xs leading-none text-white uppercase">
                {symbol.toLowerCase()}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col px-4">
          <div className="text-primary dark:text-primary-foreground mb-1 flex items-center text-xs font-semibold whitespace-nowrap">
            {formatNumber(balance)} {symbol}
          </div>
          <div className="text-xs font-medium whitespace-nowrap text-gray-300">
            ${formatNumber(priceValue)}
          </div>
        </div>

        {/* <button className="bg-blue-300/10 dark:text-blue dark:bg-blue-300/15 hover:bg-blue-300/25 focus:bg-blue-300/25 active:bg-blue-300/30 dark:active:bg-blue-300/38 dark:hover:bg-blue-300/25 dark:focus:bg-blue-300/25 text-blue ml-auto flex w-18 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50">
          Trade
        </button> */}
      </CardContent>
    </Card>
  );
}
