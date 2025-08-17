import { Metadata } from 'next';

import { ApiPath } from '@/lib/data/api-path';
import { Fetcher } from '@/lib/fetcher';

import MarketMain from './market-detail';

// 生成动态元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ marketId: string }>;
}): Promise<Metadata> {
  try {
    // 获取市场数据
    const { marketId } = await params;
    const market = await Fetcher<Record<string, string>>(
      ApiPath.oddsMarketDetail.replace('{marketId}', marketId)
    );

    if (!market) {
      return {};
    }

    return {
      title: `Tadle Odds | ${market.title || ''}`,
      description: market.description,
      openGraph: {
        title: `Tadle Odds | ${market.title || ''}`,
        description: `Tadle Odds - ${market.description}`,
        images: [market.image_url],
        url: `https://tadle.com/odds/market/${marketId}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `Tadle Odds | ${market.title || ''}`,
        description: `Tadle Odds - ${market.description}`,
        images: [market.image_url],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {};
  }
}

export default async function MarketDetail({ params }: { params: Promise<{ marketId: string }> }) {
  const { marketId } = await params;

  return <MarketMain mId={marketId} />;
}
