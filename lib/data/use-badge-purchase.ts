import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

interface BadgePurchaseParams {
  wallet: string;
  token_name: string;
  nft_name: string;
  [key: string]: string;
}

export function useBadgePurchase() {
  return createMutationHook<BadgePurchaseParams>(
    ApiPath.badgePurchase,
    (args: unknown, address: string) => {
      const { token_name, nft_name } = args as { token_name: string; nft_name: string };
      return {
        wallet: address,
        token_name,
        nft_name,
      };
    },
    SUCCESS_MESSAGES.BADGE_PURCHASE_SUCCESS,
    ERROR_MESSAGES.BADGE_PURCHASE_FAILED,
    { checkAddress: true, checkAccount: false, refreshQueryKey: ['badge', 'wallet', 'nfts'] }
  )();
}
