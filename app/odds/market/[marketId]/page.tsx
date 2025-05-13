import { Metadata } from 'next';

import { ApiPath } from '@/lib/data/api-path';

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
    const marketData = await fetch(ApiPath.oddsMarketDetail.replace('{marketId}', marketId));
    const market = await marketData.json();

    if (!market) {
      return {};
    }

    return {
      title: `${market.title || 'Market'} | Tadle Odds`,
      description: market.description,
      openGraph: {
        title: `${market.title || 'Market'} | Tadle Odds`,
        description: market.description,
        images: [market.image_url],
        url: `https://tadle.com/odds/market/${marketId}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${market.title || 'Market'} | Tadle Odds`,
        description: market.description,
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
