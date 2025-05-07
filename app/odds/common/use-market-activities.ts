import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

interface IMarket {
  id: string;
  title: string;
}

interface IUser {
  name: string;
  avatar: string;
}

interface IOutcome {
  index: number;
  name: string;
}

interface IAction {
  type: 'bought';
  outcome: IOutcome;
  price: number;
  amount: string;
}

export interface IActivity {
  market: IMarket;
  image: string;
  user: IUser;
  action: IAction;
  time: number;
}

export interface IMarketActivities {
  activities: IActivity[];
}

export function useMarketActivities() {
  return createQueryHook<IMarketActivities>(
    ApiPath.oddsMarketActivities,
    () => ['market', 'activities'],
    (url) => {
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
