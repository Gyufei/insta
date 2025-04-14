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
    setCurrentComponent({ name: 'DepositMon' });
  }

  return (
    <button
      onClick={handleDeposit}
      className="text-cyan mr-2 flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm bg-cyan-300/10 px-4 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none hover:bg-cyan-300/25 focus:bg-cyan-300/25 focus:outline-none disabled:opacity-50 dark:hover:bg-cyan-300/25 dark:focus:bg-cyan-300/25"
    >
      <div className="flex flex-col items-center">
        <DepositIcon />
        <div className="text-primary dark:text-primary-foreground mt-2 font-medium sm:mt-4">
          Deposit
        </div>
      </div>
    </button>
  );
}

function WithdrawButton() {
  const { setCurrentComponent } = useSideDrawerStore();

  function handleWithdraw() {
    setCurrentComponent({ name: 'WithdrawMon' });
  }

  return (
    <button
      onClick={handleWithdraw}
      className="text-purple mr-2 flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm bg-purple-300/10 px-4 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none hover:bg-purple-300/25 focus:bg-purple-300/25 focus:outline-none disabled:opacity-50 dark:hover:bg-purple-300/25 dark:focus:bg-purple-300/25"
    >
      <div className="flex flex-col items-center">
        <WithdrawIcon />
        <div className="text-primary dark:text-primary-foreground mt-2 font-medium sm:mt-4">
          Withdraw
        </div>
      </div>
    </button>
  );
}
