import { useAccount } from 'wagmi';

import { APR_MONAD } from '@/config/tokens';

import { useAccountStore } from '../state/account';
import { useSelectedAccount } from './account-address/use-selected-account';
import { useMonadTokenBalance } from './balance/use-monad-token-balance';

export interface IApriorBalance {
  balance: string;
}

export function useAprioriBalance() {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { currentAccountType } = useAccountStore();

  const res = useMonadTokenBalance(
    currentAccountType === 'EOA' ? address || '' : accountInfo?.sandbox_account || '',
    APR_MONAD.address
  );

  return res;
}
