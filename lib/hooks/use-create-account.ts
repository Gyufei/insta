import { ApiPath } from '../data/api-path';
import { useMutation } from '@tanstack/react-query';
import { Fetcher } from '../fetcher';

export function useCreateAccount() {
  async function createAccount(address: string) {
    const url = new URL(ApiPath.account);
    
    const res = await Fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner: address
      }),
    });
    
    return res;
  }

  const mutation = useMutation({
    mutationFn: (address: string) => createAccount(address),
  });

  return mutation;
}
