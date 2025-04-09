import { TypedData } from 'viem';
import { ITxData } from '../model';

export function getTxTypeData(txData: ITxData) {
  const { to, data, nonce } = txData;

  const types = {
    ExecuteCall: [
      { name: 'to', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
  } as const satisfies TypedData;

  const txTypeData = {
    domain: {
      name: 'PaymentProxy',
      version: 'v2',
      chainId: 10143,
      verifyingContract: '0xf6099ab762aB74fbAdE5aE8646b448f114503f2d' as `0x${string}`,
    },
    types,
    primaryType: 'ExecuteCall' as keyof typeof types,
    message: {
      to: to as `0x${string}`,
      nonce: BigInt(nonce || '0'),
      data: data as `0x${string}`,
    },
  };

  return txTypeData;
}
