import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from '@/lib/data/api-path';
import { sendApiRequest } from '@/lib/data/helpers';

import { useOddsUserInfo } from './use-user-info';

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
  const { data: userInfo } = useOddsUserInfo();
  const userId = userInfo?.user_id;

  async function executeMutation(args: unknown) {
    try {
      const params = args as ITradeParams;
      const reqBody = {
        user_id: userId || '',
        outcome_index: params.outcome_index,
        trading_direction: params.trading_direction,
        trading_mode: params.trading_mode,
        shares: params.shares,
        price: params.price,
        signature: params.signature,
      };

      const res = await sendApiRequest(ApiPath.oddsTrade.replace('{marketId}', mId), reqBody);

      toast.success(SUCCESS_MESSAGES.TRADE_SUCCESS);

      return res;
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error(ERROR_MESSAGES.TRADE_FAILED);
      }
    }
  }

  const res = useMutation({
    mutationFn: executeMutation,
  });

  return res;
}
