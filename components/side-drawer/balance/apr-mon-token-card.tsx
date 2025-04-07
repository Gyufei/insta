import { TokenData, TokenPriceMap } from '@/lib/data/tokens';
import { useAprioriBalance } from '@/lib/data/use-aprior-balance';
import { formatNumber } from '@/lib/utils/number';
import Image from 'next/image';
import { multiply } from 'safebase';

export function AprMONTokenCard() {
  const aprMonToken = TokenData.find((token) => token.symbol === 'aprMON') || TokenData[1];
  const { data: aprioriBalance } = useAprioriBalance();
  const balance = aprioriBalance?.balance || '0';
  const priceValue = multiply(balance, String(TokenPriceMap[aprMonToken.symbol] || 0));

  return (
    <div className="dark:bg-dark-400 mt-2 flex flex-shrink-0 items-center rounded bg-white px-4 py-4 shadow select-none first:mt-0 sm:mt-4 dark:shadow-none">
      <div className="flex h-10 w-10 items-center justify-center dark:opacity-90">
        <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full">
          {aprMonToken.iconUrl ? (
            <Image
              width={40}
              height={40}
              src={aprMonToken.iconUrl || '/placeholder.svg'}
              className="h-10 w-10 flex-grow object-contain"
              alt={aprMonToken.name}
            />
          ) : (
            <div className="text-11 flex h-full w-full items-center justify-center truncate rounded-full bg-gradient-to-br from-gray-300 to-gray-900 leading-none text-white uppercase">
              {aprMonToken.symbol.toLowerCase()}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col px-4">
        <div className="text-navi-pure dark:text-light mb-1 flex items-center text-xs font-semibold whitespace-nowrap">
          {formatNumber(balance)} {aprMonToken.symbol}
        </div>
        <div className="text-12 text-grey-pure font-medium whitespace-nowrap">
          ${formatNumber(priceValue)}
        </div>
      </div>

      {/* <button className="bg-ocean-blue-pure/10 dark:text-ocean-blue-pale dark:bg-ocean-blue-pure/15 hover:bg-ocean-blue-pure/25 focus:bg-ocean-blue-pure/25 active:bg-ocean-blue-pure/30 dark:active:bg-ocean-blue-pure/38 dark:hover:bg-ocean-blue-pure/25 dark:focus:bg-ocean-blue-pure/25 text-ocean-blue-pure ml-auto flex w-18 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50">
        Trade
      </button> */}
    </div>
  );
}
