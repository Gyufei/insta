import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

interface ISalesVolume {
  create_at: number;
  sales_price: string;
  sales_volume: string;
}

function useSalesVolumeData(marketplaceId: string) {
  return createQueryHook<ISalesVolume[]>(
    ApiPath.c2cSalesVolume,
    () => ['sales-volume', marketplaceId],
    (url) => {
      url.searchParams.set('market_place_account', marketplaceId);
      return url;
    },
    {
      withAccount: false,
    }
  )();
}

export function useSalesVolume(marketplaceId: string) {
  const res = useSalesVolumeData(marketplaceId);

  const data = res.data
    ? res.data
    : (res.data || [])?.map((item: ISalesVolume) => {
        return {
          ...item,
          create_at: item.create_at * 1000,
        } as ISalesVolume;
      });

  return {
    ...res,
    data,
  };
}
