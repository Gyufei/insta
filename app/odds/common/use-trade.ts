import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from '@/lib/data/api-path';
import { createMutationHook } from '@/lib/data/helpers';

export interface ITradeArgs {
  outcome_index: string;
  trading_direction: string;
  trading_mode: string;
  shares: string;
  price?: string;
  signature?: string;
}

export interface ITradeParams {
  user_id: string;
  outcome_index: string;
  trading_direction: string;
  trading_mode: string;
  shares: string;
  price?: string;
  signature?: string;
  [key: string]: string | undefined;
}

export function useTrade(mId: string) {
  return createMutationHook<ITradeParams>(
    ApiPath.oddsTrade.replace('{marketId}', mId),
    (args: unknown, address: string, account: string) => {
      const params = args as ITradeParams;
      return {
        user_id: account,
        outcome_index: params.outcome_index,
        trading_direction: params.trading_direction,
        trading_mode: params.trading_mode,
        shares: params.shares,
        price: params.price,
        signature: params.signature,
      };
    },
    SUCCESS_MESSAGES.TRADE_SUCCESS,
    ERROR_MESSAGES.TRADE_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['user', 'positions'] }
  )();
}
