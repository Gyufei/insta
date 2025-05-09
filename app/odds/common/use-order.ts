import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from '@/lib/data/api-path';
import { createMutationHook } from '@/lib/data/helpers';

export interface ICloseOrderParams {
  user_id: string;
  order_id: string;
  [key: string]: string | undefined;
}

export interface ICancelOrderParams {
  user_id: string;
  order_id: string;
  signature: string;
  [key: string]: string | undefined;
}

export function useCloseOrder() {
  return createMutationHook<ICloseOrderParams>(
    ApiPath.oddsCloseOrder,
    (args: unknown, address: string, account: string) => {
      const params = args as ICloseOrderParams;

      return {
        user_id: account,
        order_id: params.order_id,
      };
    },
    SUCCESS_MESSAGES.ORDER_CLOSED_SUCCESS,
    ERROR_MESSAGES.ORDER_CLOSED_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['user', 'orders'] }
  )();
}

export function useCancelOrder() {
  return createMutationHook<ICancelOrderParams>(
    ApiPath.oddsCancelOrder,
    (args: unknown, address: string, account: string) => {
      const params = args as ICancelOrderParams;
      return {
        user_id: account,
        order_id: params.order_id,
        signature: params.signature,
      };
    },
    SUCCESS_MESSAGES.ORDER_CANCELLED_SUCCESS,
    ERROR_MESSAGES.ORDER_CANCELLED_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: ['user', 'orders'] }
  )();
}
