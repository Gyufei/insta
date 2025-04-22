import { HelpCircle } from 'lucide-react';

interface PriceInfoProps {
  fromSymbol: string;
  toSymbol: string;
  rate: number;
  inverseRate: number;
}

export default function PriceInfo({ fromSymbol, toSymbol, rate, inverseRate }: PriceInfoProps) {
  return (
    <div className="flex justify-between">
      <div className="text-14 leading-none text-grey-pure mr-3 flex">
        <div className="flex">
          Price
          <HelpCircle className="ml-1 h-4 w-4 text-grey-pure hover:text-ocean-blue-pure dark:hover:text-light cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="h-4 items-center whitespace-nowrap text-right leading-none">
          <span>
            1 {fromSymbol} = {rate.toFixed(2)} {toSymbol}
          </span>
        </div>
        <div className="h-4 items-center whitespace-nowrap text-right leading-none">
          <span>
            1 {toSymbol} = {inverseRate.toFixed(6)} {fromSymbol}
          </span>
        </div>
      </div>
    </div>
  );
}
