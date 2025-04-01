import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface TokenCardProps {
  name: string;
  symbol: string;
  balance: string;
  value: string;
  iconUrl: string;
  coingeckoUrl?: string;
}

export default function TokenCard({
  name,
  symbol,
  balance,
  value,
  iconUrl,
  coingeckoUrl,
}: TokenCardProps) {
  return (
    <div className="dark:bg-dark-400 mt-2 flex flex-shrink-0 items-center rounded bg-white px-4 py-4 shadow select-none first:mt-0 sm:mt-4 dark:shadow-none">
      <div className="flex h-10 w-10 items-center justify-center dark:opacity-90">
        <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full">
          {iconUrl ? (
            <Image
              width={40}
              height={40}
              src={iconUrl || '/placeholder.svg'}
              className="h-10 w-10 flex-grow object-contain"
              alt={symbol}
            />
          ) : (
            <div className="to-grey-dark text-11 flex h-full w-full items-center justify-center truncate rounded-full bg-gradient-to-br from-gray-300 leading-none text-white uppercase">
              {symbol.toLowerCase()}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col px-4">
        <div className="text-12 text-navi-pure dark:text-light mb-1 flex items-center font-semibold whitespace-nowrap">
          {balance} {symbol}
          {coingeckoUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={coingeckoUrl}
              className="text-ocean-blue-pure dark:text-ocean-blue-pale text-12 relative flex cursor-pointer items-center font-medium hover:underline focus:underline"
            >
              <ExternalLink
                className="text-grey-pure hover:text-ocean-blue-pure dark:text-grey-pure dark:hover:text-ocean-blue-pale relative ml-0.5 h-3.5 dark:opacity-90"
                style={{ top: '-1px' }}
              />
            </a>
          )}
        </div>
        <div className="text-12 text-grey-pure font-medium whitespace-nowrap">{value}</div>
      </div>

      <button className="text-11 2xl:text-12 bg-ocean-blue-pure/10 dark:text-ocean-blue-pale dark:bg-ocean-blue-pure/17 hover:bg-ocean-blue-pure/25 focus:bg-ocean-blue-pure/25 active:bg-ocean-blue-pure/30 dark:active:bg-ocean-blue-pure/38 dark:hover:bg-ocean-blue-pure/25 dark:focus:bg-ocean-blue-pure/25 text-ocean-blue-pure ml-auto flex w-18 flex-shrink-0 items-center justify-center rounded-xs py-1 font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50">
        Trade
      </button>
    </div>
  );
}
