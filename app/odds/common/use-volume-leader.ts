import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

export interface IVolumeLeaderItem {
  rank: number;
  name: string;
  avatar: string;
  volume: string;
}

export interface IVolumeLeader {
  volume_leaders: IVolumeLeaderItem[];
}

export function useVolumeLeader() {
  return createQueryHook<IVolumeLeader>(
    ApiPath.oddsVolumeLeader,
    () => ['market', 'rank', 'volume'],
    (url) => {
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
