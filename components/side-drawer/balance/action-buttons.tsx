import { DepositIcon } from '@/components/icon/deposit';
import { WithdrawIcon } from '../../icon/withdraw';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

export default function ActionButtons() {
  return (
    <div className="flex flex-shrink-0">
      <DepositButton />
      <WithdrawButton />
    </div>
  );
}

function DepositButton() {
  const { setCurrentComponent } = useSideDrawerStore();

  function handleDeposit() {
    setCurrentComponent('DepositMon');
  }

  return (
    <button
      onClick={handleDeposit}
      className="bg-turquese-pure/10 hover:bg-turquese-pure/25 focus:bg-turquese-pure/25 dark:hover:bg-turquese-pure/25 dark:focus:bg-turquese-pure/25 text-turquese-pure mr-2 flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-4 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
    >
      <div className="flex flex-col items-center">
        <DepositIcon />
        <div className="text-navi-pure dark:text-light mt-2 font-medium sm:mt-4">Deposit</div>
      </div>
    </button>
  );
}

function WithdrawButton() {
  const { setCurrentComponent } = useSideDrawerStore();

  function handleWithdraw() {
    setCurrentComponent('WithdrawMon');
  }

  return (
    <button
      onClick={handleWithdraw}
      className="bg-purple-pure/10 hover:bg-purple-pure/25 focus:bg-purple-pure/25 dark:hover:bg-purple-pure/25 dark:focus:bg-purple-pure/25 text-purple-pure mr-2 flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-4 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
    >
      <div className="flex flex-col items-center">
        <WithdrawIcon />
        <div className="text-navi-pure dark:text-light mt-2 font-medium sm:mt-4">Withdraw</div>
      </div>
    </button>
  );
}
