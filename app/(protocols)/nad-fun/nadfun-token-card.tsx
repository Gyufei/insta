import Image from 'next/image';

import { IToken } from '@/config/tokens';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn } from '@/lib/utils';
import { formatBig, formatNumber } from '@/lib/utils/number';

export function NadFunTokenCard({ token, balance }: { token: IToken; balance: string }) {
  const { address, symbol, name, logo } = token;
  const { setCurrentComponent } = useSideDrawerStore();

  function handleBuy() {
    setCurrentComponent({
      name: 'NadFunBuyToken',
      props: { token: { ...token, balance } },
    });
  }

  function handleSell() {
    setCurrentComponent({
      name: 'NadFunSellToken',
      props: { token: { ...token, balance } },
    });
  }

  const realBalance = balance ? formatBig(balance) : '';
  const displayBalance = realBalance ? formatNumber(realBalance) : '';

  return (
    <Card className="flex flex-1 px-5 flex-shrink-0 flex-col gap-3 shadow-none outline-none">
      <CardHeader className="flex h-14 items-center justify-between px-0">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 overflow-hidden">
            <div className="flex h-12 w-12 items-center justify-center dark:opacity-90">
              <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full">
                <Image
                  src={logo}
                  alt={symbol}
                  width={48}
                  height={48}
                  className="flex-grow rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-grow flex-col">
            <div className="mb-1 text-xl leading-none font-medium whitespace-nowrap">{symbol}</div>
            <div className="flex text-sm leading-none whitespace-nowrap font-normal text-gray-400">
              {name}
            </div>
          </div>
        </div>

        {balance && <div className="text-xl font-medium whitespace-nowrap">{displayBalance}</div>}
      </CardHeader>

      <CardContent className="px-0 mb-2">
        <div className="flex w-fit text-sm font-normal whitespace-normal break-all flex-shrink-0 items-center justify-start rounded-sm pr-2 py-1 leading-none text-primary transition-colors duration-75 ease-out">
          Address: {address}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex items-center justify-between px-0">
        <Button
          onClick={handleBuy}
          variant="outline"
          size="sm"
          className={cn(
            'mt-2 flex h-8 flex-1 flex-shrink-0 hover:border-pro-blue/20 hover:bg-pro-blue/20 hover:text-pro-blue cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold shadow-none whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50',
            balance && 'mr-4'
          )}
        >
          Buy
        </Button>
        {balance && (
          <Button
            onClick={handleSell}
            size="sm"
            variant="outline"
            className="mt-2 flex h-8 flex-1 flex-shrink-0 hover:border-pro-blue/20 hover:bg-pro-blue/20 hover:text-pro-blue cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
          >
            Sell
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
