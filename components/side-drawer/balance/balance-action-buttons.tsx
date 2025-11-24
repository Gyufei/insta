import { useAppKitNetwork } from '@reown/appkit/react';

import { DepositIcon } from '@/components/icon/deposit';

import { useAccountStore } from '@/lib/state/account';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { ensureMonadNetwork } from '@/lib/utils/network-guard';

import { WithdrawIcon } from '../../icon/withdraw';

export default function BalanceActionButtons() {
  const { currentAccountType } = useAccountStore();

  if (currentAccountType === 'EOA') {
    return null;
  }

  return (
    <div className="flex flex-shrink-0">
      <DepositButton />
      <WithdrawButton />
    </div>
  );
}

function DepositButton() {
  const { setCurrentComponent } = useSideDrawerStore();
  const { chainId } = useAppKitNetwork();

  async function handleDeposit() {
    const ok = await ensureMonadNetwork({
      chainId,
    });
    if (!ok) return;
    setCurrentComponent({ name: 'DepositMon' });
  }

  return (
    <button
      onClick={handleDeposit}
      className="mr-2 flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm bg-[#6E75F910] p-3 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none hover:bg-[#6E75F920] focus:bg-[#6E75F920] focus:outline-none disabled:opacity-50 dark:hover:bg-[#6E75F920] dark:focus:bg-[#6E75F920]"
    >
      <div className="flex flex-col items-center text-[#6E75F9]">
        <DepositIcon />
        <div className="text-primary font-medium mt-2">Deposit</div>
      </div>
    </button>
  );
}

function WithdrawButton() {
  const { setCurrentComponent } = useSideDrawerStore();
  const { chainId } = useAppKitNetwork();

  async function handleWithdraw() {
    const ok = await ensureMonadNetwork({
      chainId,
    });
    if (!ok) return;
    setCurrentComponent({ name: 'WithdrawMon' });
  }

  return (
    <button
      onClick={handleWithdraw}
      className="mr-2 flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm bg-[#44B6BB10] p-3 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none hover:bg-[#44B6BB20] focus:bg-[#44B6BB20] focus:outline-none disabled:opacity-50 dark:hover:bg-[#44B6BB20] dark:focus:bg-[#44B6BB20]"
    >
      <div className="flex flex-col items-center text-[#44B6BB]">
        <WithdrawIcon />
        <div className="text-primary font-medium mt-2">Withdraw</div>
      </div>
    </button>
  );
}
