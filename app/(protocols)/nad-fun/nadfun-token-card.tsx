import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { formatBig, formatNumber } from '@/lib/utils/number';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

export function NadFunTokenCard({
  logo,
  symbol,
  name,
  address,
  balance,
}: {
  logo: string;
  symbol: string;
  name: string;
  address: string;
  balance: string;
}) {
  const { setCurrentComponent } = useSideDrawerStore();

  function handleBuy() {
    setCurrentComponent({
      name: 'NadFunBuyToken',
      props: { token: { address, symbol, name, logo, balance } },
    });
  }

  function handleSell() {
    setCurrentComponent({
      name: 'NadFunSellToken',
      props: { token: { address, symbol, name, logo, balance } },
    });
  }

  const realBalance = balance ? formatBig(balance) : '';
  const displayBalance = realBalance ? formatNumber(realBalance) : '';

  return (
    <div className="dark:bg-slate-600 relative flex flex-1 flex-shrink-0 flex-col rounded bg-white px-4 pt-4 pb-6 shadow dark:shadow-none">
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="mr-4 flex -space-x-3 overflow-hidden">
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
            <div className="text-gray-300 flex text-sm leading-none whitespace-nowrap">{name}</div>
          </div>
        </div>

        {balance && <div className="text-xl font-medium whitespace-nowrap">{displayBalance}</div>}
      </div>

      <div className="mt-4">
        <div className="bg-teal/20 text-teal flex w-fit flex-shrink-0 items-center justify-start rounded-sm px-2 py-1 text-[10px] leading-none whitespace-nowrap transition-colors duration-75 ease-out 2xl:font-semibold">
          Address: {address}
        </div>
      </div>

      <Separator
 className="mt-4" />

      <div className="mt-6 flex items-center justify-between px-4">
        <button
          onClick={handleBuy}
          className="bg-blue-300/10 dark:text-blue dark:bg-blue-300/20 hover:bg-blue-300/25 focus:bg-blue-300/25 active:bg-blue-300/40 dark:active:bg-blue-300/40 dark:hover:bg-blue-300/25 dark:focus:bg-blue-300/25 text-blue mr-4 flex h-8 flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
        >
          Buy
        </button>
        {balance && (
          <button
            onClick={handleSell}
            className="bg-blue-300/10 dark:text-blue dark:bg-blue-300/20 hover:bg-blue-300/25 focus:bg-blue-300/25 active:bg-blue-300/40 dark:active:bg-blue-300/40 dark:hover:bg-blue-300/25 dark:focus:bg-blue-300/25 text-blue mr-4 flex h-8 flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
          >
            Sell
          </button>
        )}
      </div>
    </div>
  );
}
