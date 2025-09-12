import { useAccount } from 'wagmi';

import { G_MONAD } from '@/config/tokens';

import { useAccountStore } from '../state/account';
import { useSelectedAccount } from './account-address/use-selected-account';
import { useMonadTokenBalance } from './balance/use-monad-token-balance';

export interface IMagmaBalance {
  balance: string;
}

export function useMagmaBalance() {
  const { address } = useAccount();
  const { currentAccountType } = useAccountStore();
  const { data: accountInfo } = useSelectedAccount();

  const res = useMonadTokenBalance(
    currentAccountType === 'EOA' ? address || '' : accountInfo?.sandbox_account || '',
    G_MONAD.address
  );

  return res;
}
