import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from '@/lib/data/api-path';
import { Fetcher } from '@/lib/fetcher';
import { ITxResponse } from '@/lib/model';

import { useOddsUserInfo } from './use-user-info';

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
  const { data: userInfo } = useOddsUserInfo();
  const userId = userInfo?.user_id;
  const queryClient = useQueryClient();

  async function executeMutation(args: unknown) {
    try {
      const params = args as ICloseOrderParams;
      const url = ApiPath.oddsCloseOrder;

      const res = await Fetcher<ITxResponse>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId || '',
          order_id: params.order_id,
        }),
      });

      return res;
    } catch (error) {
      toast.error(ERROR_MESSAGES.ORDER_CLOSED_FAILED);
      throw error;
    }
  }

  const mutation = useMutation({
    mutationFn: executeMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'orders'] });
      toast.success(SUCCESS_MESSAGES.ORDER_CLOSED_SUCCESS);
    },
  });

  return mutation;
}

export function useCancelOrder() {
  const { data: userInfo } = useOddsUserInfo();
  const userId = userInfo?.user_id;
  const queryClient = useQueryClient();

  async function executeMutation(args: unknown) {
    try {
      const params = args as ICancelOrderParams;
      const url = ApiPath.oddsCancelOrder;

      const res = await Fetcher<ITxResponse>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId || '',
          order_id: params.order_id,
          signature: params.signature,
        }),
      });

      return res;
    } catch (error) {
      toast.error(ERROR_MESSAGES.ORDER_CANCELLED_FAILED);
      throw error;
    }
  }

  const mutation = useMutation({
    mutationFn: executeMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'orders'] });
      toast.success(SUCCESS_MESSAGES.ORDER_CANCELLED_SUCCESS);
    },
  });

  return mutation;
}
