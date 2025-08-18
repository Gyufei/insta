import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { NadFunMyTokens } from './nadfun-my-tokens';
import { NadFunTokens } from './nadfun-tokens';

export const metadata: Metadata = {
  title: 'Nad.Fun',
  openGraph: {
    title: 'Nad.Fun',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: 'Nad.Fun',
    creator: '@tadle_com',
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
