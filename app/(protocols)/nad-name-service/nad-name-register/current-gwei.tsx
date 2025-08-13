import { Fuel } from 'lucide-react';
import { useGasPrice } from 'wagmi';

import { WithLoading } from '@/components/common/with-loading';

import { formatBig } from '@/lib/utils/number';

export function CurrentGWei() {
  const { data: gasPrice, isLoading } = useGasPrice();

  return (
    <div className="my-4 flex items-center gap-2">
      <Fuel className="w-5 h-5" />
      <WithLoading isLoading={isLoading} className="ml-2">
        <p className="text-gray-600">{`${gasPrice ? formatBig(gasPrice.toString(), 9) : '0.0'} GWei`}</p>
      </WithLoading>
    </div>
  );
}
