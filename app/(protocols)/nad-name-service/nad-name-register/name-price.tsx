import { Card, CardContent } from '@/components/ui/card';
import { WithLoading } from '@/components/common/with-loading';

import { INadNamePrice } from '@/lib/data/use-nadname-price';
import { formatBig } from '@/lib/utils/number';

export function NamePrice({
  priceData,
  isLoading,
}: {
  priceData: INadNamePrice | null | undefined;
  isLoading: boolean;
}) {
  const displayPrice = formatBig(priceData?.base || '0');

  return (
    <Card className="py-0">
      <CardContent className="p-4 space-y-2 text-xs">
        <div className="flex items-center justify-between text-gray-500">
          <p>Registration fee </p>
          <div className="flex items-center space-x-2">
            <WithLoading isLoading={isLoading}>
              <p>{displayPrice} MON /</p>
            </WithLoading>
            <div className="flex space-x-2 items-center justify-center">
              <p className="font-bold text-black">Lifetime</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between text-gray-500">
          <p>Discount: </p>
          <p>-</p>
        </div>
        <div className="flex justify-between font-bold text-base">
          <p>Estimated total </p>
          <WithLoading isLoading={isLoading}>
            <p>{displayPrice} MON</p>
          </WithLoading>
        </div>
      </CardContent>
    </Card>
  );
}
