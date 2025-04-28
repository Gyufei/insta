import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IAmbientPosition {
  chainId: string;
  base: string;
  quote: string;
  poolIdx: number;
  bidTick: number;
  askTick: number;
  isBid: boolean;
  user: string;
  timeFirstMint: number;
  latestUpdateTime: number;
  lastMintTx: string;
  firstMintTx: string;
  positionType: string;
  ambientLiq: number;
  concLiq: number;
  rewardLiq: number;
  liqRefreshTime: number;
  aprDuration: number;
  aprPostLiq: number;
  aprContributedLiq: number;
  aprEst: number;
  positionId: string;
}

export interface IAmbientPositionsResponse {
  positions: IAmbientPosition[];
}

export function useAmbientPosition() {
  return createQueryHook<IAmbientPositionsResponse>(
    ApiPath.ambientPosition,
    (account) => ['ambient', 'position', account ?? ''],
    (url, account) => {
      if (!account) {
        return null;
      }
      url.searchParams.set('sandbox_account', account);
      return url;
    },
    {
      withAccount: true,
    }
  )();
}
