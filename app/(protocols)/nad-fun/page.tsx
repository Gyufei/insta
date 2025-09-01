import { Metadata } from 'next';

import { MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { NadFunMyTokens } from './nadfun-my-tokens';
import { NadFunTokens } from './nadfun-tokens';

export const metadata: Metadata = {
  title: 'Nad.Fun',
  openGraph: {
    title: 'Nad.Fun',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `https://cdn.tadle.com/images/social-card.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nad.Fun',
    site: '@tadle_com',
  },
};

export default function NadFun() {
  return (
    <CommonPageLayout title="Nad.Fun" iconSrc="/icons/nad-fun.svg">
      <NadFunTokens />
      <NadFunMyTokens />
    </CommonPageLayout>
  );
}
