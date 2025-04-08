import { ApiPath } from './api-path';
import { Fetcher } from '../fetcher';
import { useQuery } from '@tanstack/react-query';

export interface IAprioriInfo {
  apr: number;
  stakers: number;
  tvl: string;
}

export function useAprioriInfo() {
  async function getAprioriInfo(): Promise<IAprioriInfo> {
    const url = new URL(ApiPath.aprioriInfo);
    return Fetcher<IAprioriInfo>(url);
  }

  const queryResult = useQuery({
    queryKey: ['aprioriInfo'],
    queryFn: () => getAprioriInfo(),
  });

  return queryResult;
} 