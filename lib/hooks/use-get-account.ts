import { ApiPath } from '../data/api-path';
import { useQuery } from '@tanstack/react-query';
import { Fetcher } from '../fetcher';
export function useGetAccount(address: string | undefined) {
  async function getAccount() {
    if (!address) {
      return null;
    }

    const url = new URL(ApiPath.account);
    url.searchParams.set('address', address);

    const res = await Fetcher(url);
    return res;
  }

  const queryResult = useQuery({
    queryKey: ['account', address],
    queryFn: () => getAccount(),
  });

  return queryResult;
}
