import { DollarSign } from 'lucide-react';
import { DepositIcon } from '@/components/icon/deposit';
import { WithdrawIcon } from '../icon/withdraw';

export default function ActionButtons() {
  return (
    <div className="flex flex-shrink-0">
      <DepositButton />
      <WithdrawButton />
      <TradeButton />
    </div>
  );
}

function DepositButton() {
  return (
    <button className="bg-turquese-pure/10 hover:bg-turquese-pure/25 focus:bg-turquese-pure/25 dark:hover:bg-turquese-pure/25 dark:focus:bg-turquese-pure/25 text-turquese-pure mr-2 flex flex-1 flex-shrink-0 items-center justify-center rounded-sm px-4 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50">
      <div className="flex flex-col items-center">
        <DepositIcon />
        <div className="text-navi-pure dark:text-light mt-2 font-medium sm:mt-4">Deposit</div>
      </div>
    </button>
  );
}

function WithdrawButton() {
  return (
    <button className="bg-purple-pure/10 hover:bg-purple-pure/25 focus:bg-purple-pure/25 dark:hover:bg-purple-pure/25 dark:focus:bg-purple-pure/25 text-purple-pure mr-2 flex flex-1 flex-shrink-0 items-center justify-center rounded-sm px-4 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50">
      <div className="flex flex-col items-center">
        <WithdrawIcon />
        <div className="text-navi-pure dark:text-light mt-2 font-medium sm:mt-4">Withdraw</div>
      </div>
    </button>
  );
}

function TradeButton() {
  return (
    <button className="bg-yellow-pure/10 hover:bg-yellow-pure/25 focus:bg-yellow-pure/25 dark:hover:bg-yellow-pure/25 dark:focus:bg-yellow-pure/25 text-yellow-pure flex flex-1 flex-shrink-0 items-center justify-center rounded-sm px-4 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50">
      <div className="flex flex-col items-center">
        <div className="bg-yellow-pure/10 text-yellow-pure flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
          <DollarSign className="h-7 dark:opacity-90" />
        </div>
        <div className="text-navi-pure dark:text-light mt-2 font-medium sm:mt-4">Trade</div>
      </div>
    </button>
  );
}
