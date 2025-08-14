import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { ApiPath } from './api-path';
import { createMutationHook } from './helpers';

export interface UniswapCreateCoinParams {
  wallet: string;
  sandbox_account: string;
  token_name: string;
  token_symbol: string;
  token_url: string;
  token_description: string;
  telegram_link: string;
  website: string;
  initial_supply: string;
  [key: string]: string;
}

export interface UniswapCreateCoinArgs {
  token_name: string;
  token_symbol: string;
  token_url: string;
  token_description: string;
  telegram_link: string;
  website: string;
  initial_supply: string;
}

export function useUniswapCreateCoin() {
  return createMutationHook<UniswapCreateCoinParams>(
    ApiPath.uniswapCreateToken,
    (args: unknown, address: string, account: string) => {
      const params = args as UniswapCreateCoinArgs;
      return {
        wallet: address,
        sandbox_account: account,
        token_name: params.token_name,
        token_symbol: params.token_symbol,
        token_url: params.token_url,
        token_description: params.token_description,
        telegram_link: params.telegram_link,
        website: params.website,
        initial_supply: params.initial_supply,
      };
    },
    SUCCESS_MESSAGES.CREATE_TOKEN_SUCCESS,
    ERROR_MESSAGES.CREATE_TOKEN_FAILED,
    { checkAddress: true, checkAccount: true, refreshQueryKey: [] }
  )();
}
