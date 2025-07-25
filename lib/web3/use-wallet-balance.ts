import { useAccount } from 'wagmi';

import { useAddressBalance } from './use-address-balance';

export function useWalletBalance(chainId: number) {
  const { address } = useAccount();

  const res = useAddressBalance(chainId, address || '');

  return res;
}
