import { DepositIcon } from '@/components/icon/deposit';

import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { WithdrawIcon } from '../../icon/withdraw';

export default function BalanceActionButtons() {
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
      className="mr-2 flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm bg-primary-foreground border border-border px-4 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none hover:bg-primary-foreground/25 focus:bg-primary-foreground/25 focus:outline-none disabled:opacity-50 dark:hover:bg-primary-foreground/25 dark:focus:bg-primary-foreground/25"
    >
      <div className="flex flex-col items-center text-primary">
        <DepositIcon />
        <div className="text-primary mt-2 font-medium sm:mt-4">Deposit</div>
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
      className="mr-2 flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm bg-primary-foreground border border-border px-4 py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none hover:bg-primary-foreground/25 focus:bg-primary-foreground/25 focus:outline-none disabled:opacity-50 dark:hover:bg-primary-foreground/25 dark:focus:bg-primary-foreground/25"
    >
      <div className="flex flex-col items-center">
        <WithdrawIcon />
        <div className="text-primary mt-2 font-medium sm:mt-4">Withdraw</div>
      </div>
    </button>
  );
}
