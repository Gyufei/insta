import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IAprioriInfo {
  apr: number;
  stakers: number;
  tvl: string;
  vault_contract_address: string;
}

export function useAprioriInfo() {
  return createQueryHook<IAprioriInfo>(
    ApiPath.aprioriInfo,
    () => ['apriori', 'info'],
    (url) => url,
    {
      withAccount: false,
    }
  )();
}
