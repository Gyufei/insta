import { useAccount } from 'wagmi';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';
import { useAccountStore } from '@/lib/state/account';

export interface IUserBalances {
  user_asset_balance: string;
  user_share_balance: string;
  user_debt_balance: string;
  user_asset_display_balance: string;
  user_share_display_balance: string;
  user_debt_display_balance: string;
}

export interface ICurvanceMarketUserItem {
  market_address: string;
  total_debt_in_usd: string;
  total_max_debt_in_usd: string;
  total_collateral_in_usd: string;
  cooldown: string;
  token0: IUserBalances;
  token1: IUserBalances;
}

export function useCurvanceMarketUserInfo(enabled?: boolean) {
  const { address: wallet } = useAccount();
  const { currentAccountType } = useAccountStore();

  return createQueryHook<ICurvanceMarketUserItem[]>(
    ApiPath.curvanceMarketUserInfo,
    (account) => [
      'curvance',
      'market_user_info',
      currentAccountType === 'EOA' ? `${wallet}+${wallet}` : `${wallet}+${account}`,
    ],
    (url, account) => {
      if (!wallet || (currentAccountType === 'DSA' && !account)) {
        return null;
      }

      url.searchParams.set('wallet', wallet);
      url.searchParams.set(
        'sandbox_account',
        currentAccountType === 'EOA' ? wallet : account || ''
      );

      return url;
    },
    {
      withAccount: currentAccountType === 'EOA' ? false : true,
      enabled,
      staleTime: 30_000,
    }
  )();
}