import { useAccount } from 'wagmi';

import { useAccountStore } from '@/lib/state/account';

import { WalletCard } from './wallet-card';

export function WalletDisplay({ className }: { className?: string }) {
  const { address } = useAccount();
  const { currentAccountType, setCurrentAccountType } = useAccountStore();

  function handleClick() {
    setCurrentAccountType('EOA');
  }

  return (
    <div className={className}>
      <div className="text-sm font-semibold mb-4">EOA</div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <WalletCard
          walletAddress={address || ''}
          isCurrent={currentAccountType === 'EOA'}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
