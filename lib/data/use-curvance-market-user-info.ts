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
      // 在 EOA 模式下，不发送依赖 sandbox_account 的请求
      if (currentAccountType === 'EOA') {
        return null;
      }

      // 仅在 DSA 下继续；同时需要 wallet 与 sandbox_account
      if (!wallet || !account) {
        return null;
      }

      url.searchParams.set('wallet', wallet);
      // EOA 已在上方直接返回；此处必为 DSA，直接使用 sandbox_account
      url.searchParams.set('sandbox_account', account || '');

      return url;
    },
    {
      // 始终要求 DSA 账户；EOA 通过上方返回 null 来禁用查询
      withAccount: true,
      enabled,
      staleTime: 30_000,
    }
  )();
}